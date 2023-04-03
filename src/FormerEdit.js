const FormerEdit = (props) => {
  return (
    <>
      <div className="internalSettings">
        <table>
          <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: "center" }}>
                {props.header}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>Information Goes Here</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FormerEdit;
