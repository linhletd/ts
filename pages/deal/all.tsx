import RouteValidator from 'src/auth/routes/Validator';
// import Head from 'next/head';
import _DealList from 'src/components/Deal/List/DealList';

export default function DealList() {
    return (
        <RouteValidator allowedAuthorities={['canListDeal']} authorityKey="permissions">
            <p>123</p>
            <_DealList/>
        </RouteValidator>
    )
}