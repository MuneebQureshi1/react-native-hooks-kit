import useCallApiWhenRequired from "./useCallApiWhenRequired";
import useCallApiOnLoad from "./useCallApiOnload";

const { loading, callApi } = useCallApiWhenRequired(yourApiFunction, (data) => {
  // your logic here
});

const { loading, data } = useCallApiOnLoad(yourApiFunction,undefined,true, (data) => {
  // your logic here
});