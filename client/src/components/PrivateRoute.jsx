import { Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';


export { PrivateRoute };

function PrivateRoute({ component: Component, ...rest }) {
    const auth = useRecoilValue(isLoggedInState);
    return (
        <Route {...rest} render={props => {
            if (!auth) {
                // not logged in so Navigate to login page with the return url
                return <Navigate to={{ pathname: '/SignIn', state: { from: props.location } }} />
            }

            // authorized so return component
            return <Component {...props} />
        }} />
    );
}