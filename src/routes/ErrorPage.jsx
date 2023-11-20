import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    // const error = useRouteError();
    // console.error(error);
    return (
        <div id="error-page" className="text-center pt-5">
            <h1 className="text-danger">Oops!</h1>
            <p className="text-secondary">
                Sorry, an unexpected error has occurred.
            </p>
            <p>{/* <i>{error.statusText || error.message}</i> */}</p>
        </div>
    );
};
export default ErrorPage;
