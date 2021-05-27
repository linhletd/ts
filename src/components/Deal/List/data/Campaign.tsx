import React from 'react';
import { useTranslation } from 'react-i18next';
import { createFetcher } from 'src/util/request';
import APIProvider from 'src/util/api/url/APIProvider';
import useSWR from 'swr';

export default function RowCampaign({ row }) {
  const { t } = useTranslation();
  let { data, error } = useSWR(['CAMPAIGN_GROUP_LIST'], createFetcher(APIProvider.getUrl('CONFIG_TYPE'), {params: {type: 'CAMPAIGN_GROUP'}}));

  if(!data){
    return error ? t('error') + '!' : 'loading...'
  }
  const campaignGroup = row.campaign && data.find(elem => elem.id === row.campaign.configCampaignGroup)
  return (
      <>
        <p>
          {t('page.contact.customer.list.column.campaignGroup')}: {campaignGroup?.configKey}
        </p>
        <p>
          {t('page.contact.campaign.name')}: {row.campaign?.name}
        </p>
      </>
  );
}
