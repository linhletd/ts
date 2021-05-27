import React, { useState } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { useGet } from '../../../hooks/useRequest';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import ContactInfo from '../../Common/ContactDeal/Side/ContactInfo/ContactInfo';
import LearnHistory from '../../Common/ContactDeal/Main/LearnHistory/LearnHistory';
import ActivityHistory from '../../Common/ContactDeal/Main/ActivityHistory/ActivityHistory';
import CommentHistory from '../../Common/ContactDeal/Main/CommentHistory/CommentHistory';
import CallHistory from '../../Common/ContactDeal/Main/CallHistory/CallHistory';
import DealTools from '../../Common/ContactDeal/Main/DealTools/DealTools';
import AccountMange from '../../Common/ContactDeal/Main/AccountManage/AccountMange';
// import TicketInfo from '../../Common/ContactDeal/Side/TicketInfo/TicketInfo';
// import DealInfo from '../../Common/ContactDeal/Side/DealInfo/DealInfo';
import DealTimeLine from '../../Common/ContactDeal/Side/TimelineInfo/DealTimeline';
import DealDetailContext, { AreaNames } from './DealDetailContext';
import TicketInfo from '../../Common/ContactDeal/Main/TicketInfo/TicketInfo';
import DealInfo from '../../Common/ContactDeal/Main/DealInfo/DealInfo';
import ShipmentInfo from '../../Common/ContactDeal/Main/ShipmentInfo/ShipmentInfo';
import FallbackPage from '../../Fallback/FallbackPage';

export default function DealEdit({ match }) {
  let [cacheKey, reload] = useState(Math.random());
  let [reloadSubcriberStore] = useState({});
  let { t } = useTranslation();
  let { data: deal, status, error } = useGet(['DEAL_ITEM', { id: match.params.id, cacheKey }], APIProvider.getUrl('DEAL_ITEM'), {
    params: { id: match.params.id },
  });
  let [store] = useState({ prevDeal: null });
  reloadSubcriberStore[AreaNames.ENTIRE_PAGE] = function handleReload() {
    reload(Date.now());
  };
  if (!deal && !store.prevDeal) {
    return <FallbackPage status={status} code={error?.status} />;
  }
  deal && (store.prevDeal = deal);
  deal = store.prevDeal;
  let { contact } = deal;
  return (
    <>
      <Helmet title={t('helmet.title.deal.detail')} />
      <DealDetailContext.Provider value={reloadSubcriberStore}>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-3">
                <ContactInfo object={deal} />
                {/* <AccountInfo object={deal} /> */}
                <DealTimeLine deal={deal} />
                {/* <TicketInfo contact={contact} /> */}
                {/* <DealInfo contact={contact} mainDeal={deal} /> */}
              </div>
              <div className="col-sm-9">
                <DealTools deal={deal} key={`${deal.id}-tool`} />
                <CommentHistory object={deal} key={`${deal.id}-comment`} />
                <AccountMange object={deal} />
                <DealInfo contact={deal.contact} mainDeal={deal} key={`${deal.id}-deal`} />
                <ShipmentInfo object={deal} />
                <TicketInfo contact={deal.contact} key={`${deal.contact.id}-ticket`} />
                <CallHistory object={deal} key={`${deal.id}-call`} />
                <LearnHistory contact={contact} />
                <ActivityHistory object={deal} key={`${deal.id}-activity`} />
              </div>
            </div>
          </div>
        </section>
      </DealDetailContext.Provider>
    </>
  );
}
