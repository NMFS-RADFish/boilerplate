import { Link } from "@trussworks/react-uswds";

export const HomePage = ({ syncToHomebase, isLoading, isSynced }) => {
  const date = new Date(parseInt(localStorage.getItem("lastHomebaseSync"), 10));
  return (
    <div>
      <h1>Home Page</h1>
      {isSynced ? (
        <>
          <h2>Application is Synced! Ready to depart</h2>
          <p>Last sync: {date.toTimeString()}</p>
          <button onClick={syncToHomebase} disabled={isLoading}>
            Resync to Homebase
          </button>
          <ul>
            <li>
              <Link className="grid-col flex-1" href={"/tripReport"}>
                Trip Report Table
              </Link>
            </li>
            <li>
              <Link className="grid-col flex-1" href={"/tripReportClamLobster"}>
                Trip Report 2
              </Link>
            </li>
          </ul>
        </>
      ) : (
        <button onClick={syncToHomebase} disabled={isLoading}>
          Sync to Homebase
        </button>
      )}

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};
