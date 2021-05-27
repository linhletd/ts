import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../assets/css/slice.css';
import { useGet } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';
import GlobalContext from '../../../context/GlobalContext';

export default function FilterShortCutSlide({ stages, getStageLabel, resetIdx, ...rest }) {
  let { t } = useTranslation();
  let [curIndex, setIndex] = useState();

  useEffect(() => {
    setIndex(undefined);
  }, [resetIdx]);

  const settings = {
    dots: false,
    slidesToShow: 1,
    infinite: true,
    slideToScroll: 3,
    variableWidth: true,
    className: 'row justify-content-center align-items-center',
  };
  let filterShortcuts = useMemo(() => {
    if (!stages.length) {
      return [];
    }
    function findStageid(levelArr) {
      let selectedStages = [];
      levelArr.map((level) => {
        let stage = stages.find((elem) => elem.level === level);
        if (stage) {
          selectedStages.push({ value: stage.id, label: getStageLabel(stage) });
        }
      });
      return selectedStages;
    }
    let shortcuts = [
      {
        text: t('page.deal.filter.shortcut.all'),
        filter: {}, //all
      },
      {
        text: t('page.deal.filter.shortcut.stage.latest'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L1.1']),
          level: 'L1',
        }, // Mới nhất
      },
      {
        text: t('page.deal.filter.shortcut.stage.noAnswer'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L1.2', 'L1.3']),
          level: 'L1',
        }, // Không nghe máy
      },
      {
        text: t('page.deal.filter.shortcut.stage.potential'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L2.1']),
          level: 'L2',
        }, // Tiềm năng
      },
      {
        text: t('page.deal.filter.shortcut.stage.inProgress'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L2.2', 'L2.3']),
          level: 'L2',
        }, // Đang xử lý
      },
      {
        text: t('page.deal.filter.shortcut.stage.trial'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L3.1']),
          level: 'L3',
        }, // học thử
      },
      {
        text: t('page.deal.filter.shortcut.stage.trialEnd'),
        filter: {
          status: 'OPEN',
          stage: findStageid(['L3.2']),
          level: 'L3',
        }, // Chốt học thử
      },
      {
        text: t('page.deal.filter.shortcut.stage.order'),
        filter: {
          status: 'WON',
          stage: findStageid(['L6']),
          level: 'L6',
        }, // Đặt hàng
      },
      {
        text: t('page.deal.filter.shortcut.stage.wrongNumber'),
        filter: {
          status: 'LOST',
          stage: findStageid(['L1.4']),
          level: 'L1',
        }, // Sai số
      },
      {
        text: t('page.deal.filter.shortcut.stage.refuse'),
        filter: {
          status: 'LOST',
          stage: findStageid(['L4.1', 'L4.2', 'L4.3']),
          level: 'L4',
        }, // Từ chối
      },
      {
        text: t('page.deal.filter.shortcut.stage.stopCare'),
        filter: {
          status: 'LOST',
          stage: findStageid(['L5.1', 'L5.2', 'L5.3', 'L5.4']),
          level: 'L5',
        }, // Dừng chăm sóc
      },
    ];
    shortcuts.map((cur, i) => {
      cur.key = i;
    });
    return shortcuts;
  }, [stages]);
  return (
    <Slider {...settings}>
      {filterShortcuts.map((cur) => (
        <ShortcutButton data={cur} key={cur.key} curIndex={curIndex} setIndex={setIndex} {...rest} />
      ))}
    </Slider>
  );
}

function ShortcutButton({ data, curIndex, setIndex, setFilter, filterToPayload }) {
  let { dealFilter } = useContext(GlobalContext);
  let { text, key, filter } = data;
  let unionFilter = useMemo(() => {
    return _getUnionFilterShortCut(dealFilter, filter);
  }, [dealFilter, filter]);
  let payload = useMemo(() => {
    if (unionFilter) {
      return filterToPayload(unionFilter);
    }
    return unionFilter;
  }, [unionFilter]);
  let res = useGet(['DEAL_FILTER', { filterData: payload }], `${APIProvider.getUrl('DEAL_FILTER')}?size=1`, payload, 'POST', { enabled: !!payload });
  let commonProps = {
    onClick: () => {
      setIndex(key);
      setFilter(unionFilter);
    },
    className: `btn  ${curIndex === key ? 'btn-success' : 'btn-primary'}`,
  };
  return (
    <div
      className="pl-1 pr-1"
      key={key}
      onDrag={(e) => {
        e.preventDefault();
      }}
    >
      <button {...commonProps} type="submit" disabled={!res.data?.totalElements}>
        {text}&nbsp;<span className="text-dark text-bold">{res.data ? res.data.totalElements : ''}</span>
      </button>
    </div>
  );
}
function _getUnionFilterShortCut(dealFilter, slideFilter) {
  if (Object.keys(slideFilter).length === 0) {
    return { ...dealFilter, level: '', stage: '', status: '' };
  }
  return { ...dealFilter, ...slideFilter };

  // if (Object.keys(slideFilter).length === 0 || Object.keys(dealFilter).length === 0) {
  //   return { ...dealFilter, ...slideFilter };
  // }
  // let outputFilter = { ...dealFilter };
  // let comparableProps = Object.keys(slideFilter);
  // for (let i = 0; i < comparableProps.length; i++) {
  //   let key = comparableProps[i];
  //   if (!outputFilter[key]) {
  //     outputFilter[key] = slideFilter[key];
  //   } else if (key !== 'stage') {
  //     if (outputFilter[key] !== slideFilter[key]) {
  //       return false;
  //     }
  //   } else {
  //     try {
  //       let stage = slideFilter.stage.filter((elem) => outputFilter.stage.includes(elem));
  //       if (stage.length) {
  //         outputFilter.stage = stage;
  //       } else {
  //         return false;
  //       }
  //     } catch {
  //       console.log('wrong type');
  //       return false;
  //     }
  //   }
  // }
  // return outputFilter;
}
