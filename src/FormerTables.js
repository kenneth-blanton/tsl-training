import FormerTablesDetails from "./FormerTablesDetails";
import OnButton from "./OnButton";
import FormerTableStructure from "./FormerTableStructure";

const FormerTables = (props) => {
  return (
    <>
      <div className="settings" key={props.id}>
        <OnButton id={props.id} status={props.status}></OnButton>
        <FormerTableStructure
          key={props.id}
          id={props.id}
          header={props.header}
          tab={props.tab}
          status={props.status}
          tabValue={props.tabValue}
          intTabs={props.intTabs}
          intVals={props.intVals}
          desc={props.desc}
          intStatus={props.intStatus}
        />
        <FormerTablesDetails header={props.header}></FormerTablesDetails>
      </div>
    </>
  );
};

export default FormerTables;
