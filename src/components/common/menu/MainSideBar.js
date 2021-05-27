import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Link from 'next/link'

import BrowserProvider from 'src/util/browser/BrowserProvider';
import MenuGroup from './MenuGroup';

import MenuItem from './MenuItem';
import ComponentValidator from 'src/auth/components/Validator';

export default React.forwardRef(function MainSideBar(props, ref) {
  const { t } = useTranslation();
  const [showScroll, setShowScroll] = useState(false);
  function handleMouseOver() {
    !showScroll && setShowScroll(true);
  }
  function handleMouseLeave() {
    showScroll && setShowScroll(false);
  }
  return (
    <aside
      className={`main-sidebar sidebar-dark-primary elevation-4 position-fixed overflow-y-auto ${showScroll ? 'show-scroll' : 'show-scroll-hidden'}`}
      style={{ height: '100vh' }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      {/* Brand Logo */}
      {/* <a href="index3.html" className="brand-link">
        <img src="/images/logo192.png" alt={t('app.generics.title')} className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
        <span className="brand-text font-weight-light">{t('app.generics.title')}</span>
      </a> */}

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src="/images/logo192.png" className="img-circle elevation-2" alt={t('app.generics.name')} />
          </div>
          <div className="info">
            <Link href={BrowserProvider.getUrl('HOME')} className="d-block">
              {t('app.generics.name')}
            </Link>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/*Menu - Administrator*/}

            <MenuGroup title={t('component.menu.administrator')} icon="fa-folder-open" initialOpen>
              <ComponentValidator allowedAuthorities={['canListUser']} authorityKey="permissions">
                <MenuItem title={t('component.menu.user')} link={`${BrowserProvider.getUrl('USER_LIST')}?page=1`} icon="fa-user" path="/user" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListRole']} authorityKey="permissions">
                <MenuItem title={t('component.menu.role')} link={`${BrowserProvider.getUrl('ROLE_LIST')}?page=1`} icon="fa-users" path="/role" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListPermission']} authorityKey="permissions">
                <MenuItem title={t('component.menu.permission')} link={`${BrowserProvider.getUrl('PERMISSION_LIST')}?page=1`} icon="fa-check" path="/permission" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListDepartment']} authorityKey="permissions">
                <MenuItem title={t('component.menu.department')} link={`${BrowserProvider.getUrl('DEPARTMENT_LIST')}?page=1`} icon="fa-building" path="/department" />
              </ComponentValidator>
            </MenuGroup>

            {/*Menu - Main*/}
            <MenuGroup title={t('component.menu.main')} icon="fa-folder-open" initialOpen>
              <ComponentValidator allowedAuthorities={['canListCampaign']} authorityKey="permissions">
                <MenuItem title={t('component.menu.campaign')} link={`${BrowserProvider.getUrl('CAMPAIGN_LIST')}?page=1`} icon="fa-binoculars" path="/campaign" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListContact', 'canListAllContact']} authorityKey="permissions">
                <MenuItem title={t('component.menu.contact')} link={`${BrowserProvider.getUrl('CONTACT_LIST')}?page=1`} icon="fa-address-book" path="/contact" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListDeal', 'canListAllDeal']} authorityKey="permissions">
                <MenuItem title={t('component.menu.deal')} link={`${BrowserProvider.getUrl('DEAL_LIST')}?page=1&size=10&sort=createdAt%2Cdesc`} icon="fa-shopping-cart" path="/deal" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListPackage']} authorityKey="permissions">
                <MenuItem title={t('component.menu.package')} link={`${BrowserProvider.getUrl('PACKAGE_LIST')}?page=1`} icon="fa-archive" path="/package" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListShipment', 'canListAllShipment']} authorityKey="permissions">
                <MenuItem title={t('component.menu.shipment')} link={`${BrowserProvider.getUrl('SHIPMENT_LIST')}?page=1`} icon="fa-shipping-fast" path="/shipment" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListTicket', 'canListAllTicket']} authorityKey="permissions">
                <MenuItem title={t('component.menu.list.ticket')} link={`${BrowserProvider.getUrl('TICKET_LIST')}?page=1`} icon="fa-ticket-alt" path="/ticket" />
              </ComponentValidator>
            </MenuGroup>

            {/*Menu - Report*/}
            <MenuGroup title={t('component.menu.report')} icon="fa-folder-open">
              <ComponentValidator allowedAuthorities={['canReportAutoCall']} authorityKey="permissions">
                <MenuItem title={t('component.menu.autocall.report')} link={BrowserProvider.getUrl('REPORT_AUTO_CALL')} icon="fa-chart-bar" path="/report-auto-call" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canReportPipeline']} authorityKey="permissions">
                <MenuItem title={t('component.menu.pipeline.report')} link={BrowserProvider.getUrl('PIPELINE_REPORT')} icon="fa-chart-line" path="/report-express-daily" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canReportSaleDetail']} authorityKey="permissions">
                <MenuItem title={t('component.menu.sale.report')} link={BrowserProvider.getUrl('SALE_REPORT')} icon="fa-chart-line" path="/sale-detail/report" />
              </ComponentValidator>
            </MenuGroup>

            {/*Menu - Tool*/}
            <MenuGroup title={t('component.menu.tool')} icon="fa-folder-open">
              <MenuItem title={t('component.menu.autocall.list')} link={`${BrowserProvider.getUrl('AUTO_CALL_LIST')}?page=1`} icon="fa-list-alt" path="/auto-call" />
              <MenuItem title={t('component.menu.call')} link={`${BrowserProvider.getUrl('CALL_LIST')}?page=1`} icon="fa-phone-square" path="/call" />

              <MenuItem title={t('component.menu.checkCodeActive')} link={BrowserProvider.getUrl('CHECK_CODE_ACTIVE')} icon="fa-list-alt" path="/check-code-active" />

              <MenuItem title={t('component.menu.sms.bulk')} link={`${BrowserProvider.getUrl('SMS_LIST')}?page=1`} icon="fa-check-square" path="/sms/all" />
              <MenuItem title={t('component.menu.sms.history')} link={`${BrowserProvider.getUrl('SMS_HISTORY')}?page=1`} icon="fa-check-square" path="/sms/history" />
              <MenuItem title={t('component.menu.ticket.type')} link={`${BrowserProvider.getUrl('TICKET_TYPE_LIST')}?page=1`} icon="fa-i-cursor" path="/type-ticket" />
              <MenuItem title={t('component.menu.voucher')} link={`${BrowserProvider.getUrl('VOUCHER_LIST')}?page=1`} icon="fa fa-box-open" path="/voucher" />
            </MenuGroup>

            {/*Menu - Config*/}
            <ComponentValidator allowedAuthorities={['canListConfig']} authorityKey="permissions">
              <MenuGroup title={t('component.menu.config')} icon="fa-folder-open">
                <MenuItem title={t('component.menu.config-campaign-group')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=CAMPAIGN_GROUP`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-campaign-type')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=CAMPAIGN_TYPE`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-product')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=PRODUCT`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-sale-type')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=SALE_TYPE`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-source-type')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=SOURCE_TYPE`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-utm-medium')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=UTM_MEDIUM`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-utm-source')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=UTM_SOURCE`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-utm-team')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=UTM_TEAM`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-ivr')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=IVR`} icon="fa-check-square" />

                <MenuItem title={t('component.menu.config-package-duration')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=PACKAGE_DURATION`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-program')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=PROGRAM`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-customer-emotion')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=CUSTOMER_EMOTION`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.config-shipment-gift')} link={`${BrowserProvider.getUrl('CONFIG_LIST')}?type=SHIPMENT_GIFT`} icon="fa-check-square" />
                <MenuItem title={t('component.menu.shipment.config')} link={`${BrowserProvider.getUrl('SHIPMENT_CONFIG_LIST')}?page=1`} icon="fa-cog" />
              </MenuGroup>
            </ComponentValidator>

            {/*Menu - Other*/}
            <MenuGroup title={t('component.menu.other')} icon="fa-folder-open">
              <ComponentValidator allowedAuthorities={['canListProvince']} authorityKey="permissions">
                <MenuItem title={t('component.menu.province')} link={`${BrowserProvider.getUrl('PROVINCE_LIST')}?page=1`} icon="fa-city" path="/province" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListDistrict']} authorityKey="permissions">
                <MenuItem title={t('component.menu.district')} link={`${BrowserProvider.getUrl('DISTRICT_LIST')}?page=1`} icon="fa-archway" path="/district" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListPipeline']} authorityKey="permissions">
                <MenuItem title={t('component.menu.pipeline.list')} link={`${BrowserProvider.getUrl('PIPELINE_LIST')}?page=1`} icon="fa-list-alt" path="/pipeline" />
              </ComponentValidator>
              <ComponentValidator allowedAuthorities={['canListStage']} authorityKey="permissions">
                <MenuItem title={t('component.menu.pipeline.stage')} link={`${BrowserProvider.getUrl('STAGE_LIST')}?page=1`} icon="fa-step-forward" path="/stage" />
              </ComponentValidator>
            </MenuGroup>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
});
