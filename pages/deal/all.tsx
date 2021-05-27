import Layout from 'src/components/common/layout/Layout';
import RouteValidator from 'src/auth/routes/Validator';
export default function DealList() {
    return (
        <Layout>
            <RouteValidator allowedAuthorities={['canListDeal']} authorityKey="permissions">
                hahahahhah
            </RouteValidator>
        </Layout>
    )
}
  //allowedAuthorities={['canListDeal']} authorityKey="permissions"