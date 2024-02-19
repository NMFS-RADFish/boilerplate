import { useParams } from "react-router-dom";
const DetailPage = () => {
  let { id } = useParams();

  return <div>Detail Page: {id}</div>;
};

export { DetailPage };
