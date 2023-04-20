import { Link } from "react-router-dom";

const TestListing = ({ data }) => {
  return (
    <div className="TestListing">
      {data.map((data, i) => {
        return (
          <Link to={`/take-test/${data.id}`} key={i}>
            <button className="test" id={data.id}>
              {data.data().title}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default TestListing;
