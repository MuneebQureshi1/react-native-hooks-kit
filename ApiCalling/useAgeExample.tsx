import useCallApiWhenRequired from "./useCallApiWhenRequired";
import useCallApiOnLoad from "./useCallApiOnload";
import useCallApiOnEveryLoad from "./useCallApiOnEveryLoad";

const { loading, callApi } = useCallApiWhenRequired(yourApiFunction, (data) => {
  // your logic here
});

const { loading, data } = useCallApiOnLoad(yourApiFunction,undefined,true, (data) => {
  // your logic here
});

const { loading, data } = useCallApiOnEveryLoad(yourApiFunction,undefined, (data) => {
  // your logic here
});