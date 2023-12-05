import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { api, GetTokenQuery } from "./api";

export function jwt({ dispatch, getState }) {

    return (next) => (action) => {

        // only worry about expiring token for async actions
        if (typeof action === 'function') {

            if (getState().auth && getState().auth.token) {

                // decode jwt so that we know if and when it expires
                var tokenExpiration = jwtDecode(getState().auth.token).exp;

                if (tokenExpiration && (moment(tokenExpiration) - moment(Date.now()) < 5000)) {

                    // make sure we are not already refreshing the token
                    if (!getState().auth.freshTokenPromise) {
                        return refreshToken(dispatch).then(() => next(action));
                    } else {
                        return getState().auth.freshTokenPromise.then(() => next(action));
                    }
                }
            }
        }
        return next(action);
    };
}

export function refreshToken(dispatch) {

    var freshTokenPromise = GetTokenQuery()
        .then(t => {
            dispatch({
                type: 'DONE_REFRESHING_TOKEN'
            });
            console.log(t)
            // dispatch(saveAppToken(t.token));

            return t.token ? Promise.resolve(t.token) : Promise.reject({
                message: 'could not refresh token'
            });
        })
        .catch(e => {

            console.log('error refreshing token', e);

            dispatch({
                type: 'DONE_REFRESHING_TOKEN'
            });
            return Promise.reject(e);
        });



    dispatch({
        type: 'REFRESHING_TOKEN',

        // we want to keep track of token promise in the state so that we don't try to refresh
        // the token again while refreshing is in process
        freshTokenPromise
    });

    return freshTokenPromise;
}