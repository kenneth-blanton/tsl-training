import { Link } from "react-router-dom";

const TestListing = ({ data, key }) => {
  return (
    <div className="TestListing">
      {data.map((data, i) => {
        return (
          <Link to={`/take-test/${data.id}`} key={i}>
            <div className="test">{data.data().title}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default TestListing;
