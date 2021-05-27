import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useGet, callPut, callPost } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/NoData';
import Select from 'react-select';
import MultiSelect from '../../Common/AsyncSearchSelect/MultiSelect';
import Alert from '../../../components/Modal/Alert';
import BrowserProvider from '../../../util/browser/BrowserProvider';
import Constants from '../../../util/Constants';

export default function AutoDataAssignConfig(props) {
  let { t } = useTranslation();
  let [alert, setAlert] = useState({ show: false });
  function closeModal() {
    setAlert({ show: false, content: '' });
  }
  function handleClick() {
    setAlert({
      show: true,
      title: t('page.deal.config.data.table'),
      content: <AutoDataAssignConfigForm closeModal={closeModal} {...props} />,
      feetless: true,
      size: 'xl',
      backdrop: 'static',
    });
  }
  return (
    <>
      <Button onClick={handleClick} className="mr-2">
        {t('page.deal.config.data.button')}
      </Button>
      <Alert handleClose={closeModal} {...alert} />
    </>
  );
}

function AutoDataAssignConfigForm({ closeModal, handleReload }) {
  let { t } = useTranslation();
  let [reqDataStore] = useState(new Map());
  let [alert, setAlert] = useState({ show: false });
  let [cacheKey, setCacheKey] = useState(Math.random());
  let { data: campaignGroups, status: s1 } = useGet(['CONFIG_TYPE', 'CAMPAIGN_GROUP', cacheKey], APIProvider.getUrl('CONFIG_TYPE'), {
    params: {
      size: 100,
      type: 'CAMPAIGN_GROUP',
    },
  });

  let { data: configs, status: s2 } = useGet(['CONFIG_DATA_LIST', cacheKey], APIProvider.getUrl('CONFIG_DATA_LIST'), {
    params: {
      size: 100,
    },
  });

  function updateConfigs(e) {
    let btn = e.target;
    btn.disabled = true;
    let failedResult = {};
    function updateConfig(data) {
      let { configId, campaigns, groupName, ...rest } = data;
      function checkReqResult(p) {
        if (p && p.then) {
          p.then(({ code }) => {
            if (code !== 200) {
              if (!failedResult[configId]) {
                failedResult[configId] = groupName;
              }
            } else {
              reqDataStore.delete(configId);
            }
          });
        }
      }
      let p1 = callPut(`${APIProvider.getUrl('CONFIG_DATA')}?id=${data.configId}`, rest);
      let p2;
      if (campaigns) {
        let campaign_ids = campaigns.reduce((acc, opt) => {
          acc.push(opt.value);
          return acc;
        }, []);

        p2 = callPut(APIProvider.getUrl('CONFIG_UPDATE_CAMPAIGN'), {
          config_data_id: configId,
          campaign_ids,
        });
      }
      checkReqResult(p1);
      checkReqResult(p2);
      return Promise.all([p1, p2]);
    }
    Promise.all([...reqDataStore.values()].map((data) => updateConfig(data))).then((result) => {
      btn.disabled = false;
      setCacheKey(Date.now());
      let failedConfigs = Object.keys(failedResult);
      setAlert({
        title: t('page.deal.config.update.result'),
        show: true,
        content: !result.length ? (
          <p>{t('page.deal.config.update.noChange')}</p>
        ) : failedConfigs.length ? (
          <div className="text-danger">
            <p>
              {failedConfigs.length}&nbsp;{t('app.generics.item')}&nbsp;{t('app.generics.update.fail')}
            </p>
            <ul>
              {failedConfigs.map((cur, i) => {
                return <li key={i}>{failedResult[cur]}</li>;
              })}
            </ul>
          </div>
        ) : (
          <p>{t('app.generics.update.success')}</p>
        ),
        handleClose() {
          setAlert({ show: false });
          if (result.length) {
            closeModal();
            handleReload();
          }
        },
      });
    });
  }
  if (campaignGroups && configs) {
    let configuredCampaingGroups = campaignGroups
      .filter((gr) => gr.isActive)
      .reduce((acc, campaignGroup) => {
        let configOfCampaignGroup = configs.content.find((config) => config.configCampaignGroup === campaignGroup.id);
        if (configOfCampaignGroup) {
          campaignGroup.configData = configOfCampaignGroup;
        } else {
          campaignGroup.configData = null;
        }
        acc.push(campaignGroup);
        return acc;
      }, []);
    let isAvailable = !!configuredCampaingGroups.length;
    if (!isAvailable) {
      return (
        <>
          <div className="mb-2 ml-2">
            <NoData status="nodata" text={t('page.deal.config.dataAssign.noCampaign')} />
          </div>
          <Link to={BrowserProvider.getUrl('USER_LIST')} target="_blank" className="ml-2">
            {t('page.deal.config.data.link')}
          </Link>
          <Button onClick={closeModal} className="float-right mr-2 btn-secondary">
            {t('app.generics.cancel')}
          </Button>
        </>
      );
    }
    return (
      <>
        <CheckAndCreateConfig reqDataStore={reqDataStore} outerKey={cacheKey} data={configuredCampaingGroups} updateConfigs={updateConfigs} closeModal={closeModal} />
        <Alert {...alert} />
      </>
    );
  }

  if ([s1, s2].includes('error')) {
    return <NoData status="error" />;
  } else {
    return <NoData status="loading" />;
  }
}
class CheckAndCreateConfig extends React.Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
    };
  }
  componentDidMount() {
    let { data } = this.props;
    let createdList = [];
    data.map((campaignGroup) => {
      if (!campaignGroup.configData) {
        createdList.push(
          callPost(APIProvider.getUrl('CONFIG_DATA'), { configCampaignGroup: campaignGroup.id, isApplyAllCampaign: false, isDescending: true, timeType: 'CREATED_DATE' }).then(({ code, data }) => {
            if (code === 200) {
              return (campaignGroup.configData = data);
            }
            return Promise.reject(code);
          }),
        );
      }
    });
    Promise.all(createdList)
      .then(() => {
        this.setState({
          data,
        });
      })
      .catch(() => {
        this.setState({
          data: false,
        });
      });
  }
  render() {
    let { data, ...rest } = this.props;
    data = this.state.data;
    if (data === undefined) {
      return <NoData status="loading" />;
    } else if (data === false) {
      return <NoData status="error" />;
    }
    return <Content configuredCampaingGroups={data} {...rest} />;
  }
}

function Content({ configuredCampaingGroups, updateConfigs, closeModal, ...rest }) {
  let { t } = useTranslation();
  return (
    <div className="col">
      {configuredCampaingGroups.map((configured) => {
        return <ConfigRow campaignGroup={configured} key={configured.id} {...rest} />;
      })}
      <Link to={BrowserProvider.getUrl('USER_LIST')} target="_blank" className="ml-2">
        {t('page.deal.config.data.link')}
      </Link>
      <div className="row justify-content-end">
        <Button onClick={updateConfigs} className="mr-2">
          {t('app.generics.update')}
        </Button>
        <Button onClick={closeModal} className="mr-2 btn-secondary">
          {t('app.generics.close')}
        </Button>
      </div>
    </div>
  );
}

function ConfigRow({ campaignGroup, reqDataStore, outerKey }) {
  let { t } = useTranslation();
  function addLabel(arr, translate) {
    return arr.map((cur) => {
      return {
        label: translate ? t(cur) : cur,
        value: cur,
      };
    });
  }
  const optionsDate = addLabel(Constants.PAGES.ASSIGN_ALL.TIME_TYPE, true);

  const optionsPriority = [
    { value: false, label: t('page.contact.modal.listShare.priority.1') },
    { value: true, label: t('page.contact.modal.listShare.priority.2') },
  ];
  let group_id = campaignGroup.id;
  let { data: configuredCampaigns = [] } = useGet(['GET_CAMPAIGN_OF_CONFIG', group_id, outerKey], APIProvider.getUrl('CONFIG_LIST_CAMPAIGN', [{ value: campaignGroup.configData.id }]));
  let { data: campaignOfGroup = [] } = useGet(['GET_CAMPAIGNS_OF_GROUP', group_id], APIProvider.getUrl('CAMPAIGN_BY_GROUP'), {
    params: {
      group_id,
    },
  });

  function changeData(field, value) {
    let configId = campaignGroup.configData.id;
    if (!reqDataStore.has(configId)) {
      let { isApplyAllCampaign, isDescending, timeType } = campaignGroup.configData;
      reqDataStore.set(configId, {
        isApplyAllCampaign,
        isDescending,
        timeType,
        groupName: campaignGroup.configValue,
        configId,
      });
    }
    reqDataStore.get(configId)[field] = value;
  }

  let campaignOptions = useMemo(() => {
    return campaignOfGroup.reduce((options, campaign) => {
      let option = {
        value: campaign.id,
        label: campaign.name,
      };
      options.push(option);
      return options;
    }, []);
  }, [campaignOfGroup]);

  let { configData } = campaignGroup;

  let selectedCampaigns = useMemo(() => {
    if (configData.isApplyAllCampaign) {
      return [...campaignOptions];
    } else {
      return configuredCampaigns.reduce((acc, configured) => {
        return acc.concat({
          label: configured.name,
          value: configured.id,
        });
      }, []);
    }
  });
  return (
    <Row>
      <Col md={3} className="mb-2 text-bold">
        {campaignGroup.configKey}
      </Col>
      <Col md={3} className="mb-2">
        <Select
          options={optionsDate}
          onChange={(opt) => {
            changeData('timeType', opt.value);
          }}
          defaultValue={optionsDate.find((opt) => opt.value === configData.timeType)}
          placeholder={t('page.contact.modal.limitNumber.timeType')}
        />
      </Col>
      <Col md={3} className="mb-2">
        <Select
          options={optionsPriority}
          onChange={(opt) => {
            changeData('isDescending', opt.value);
          }}
          defaultValue={optionsPriority.find((opt) => opt.value === configData.isDescending)}
          placeholder={t('page.contact.modal.limitNumber.priority')}
        />
      </Col>
      <Col md={3} className="mb-3">
        <MultiSelect
          options={campaignOptions}
          value={selectedCampaigns}
          handleChange={(field, opts) => {
            changeData('campaigns', opts);
            if (opts.length === campaignOptions.length) {
              changeData('isApplyAllCampaign', true);
            } else {
              changeData('isApplyAllCampaign', false);
            }
          }}
          placeholder={t('page.contact.modal.limitNumber.campaign')}
        />
      </Col>
    </Row>
  );
}
