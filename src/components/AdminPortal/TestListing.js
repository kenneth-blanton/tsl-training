import { Link } from "react-router-dom";

const AdminTestListing = ({ data }) => {
  return (
    <div className="AdminTestListing">
      {data.map((data, i) => {
        return (
          <Link to={`/edit-test/${data.id}`} key={i}>
            <button className="test" id={data.id}>
              {data.data().title}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminTestListing;
