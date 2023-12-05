import React from "react";
import "./App.css";
import RADForm from "./components/RADForm.js";

function App() {
  const [onlineStatus, setOnlineStatus] = useState(false);

  // Check if the app is offline
  const isOffline = !navigator.onLine;

  useEffect(() => {
    const handleOnline = () => {
      // You may want to refetch data when the app comes online
      // You can do that by using the refetch function from the useQuery hook
      setOnlineStatus(true);
    };

    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // need this cleanup, else event listeners are immediately removed
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOffline]);

  return (
    <div className="App">
      <Alert
        type={onlineStatus ? "success" : "error"}
        headingLevel={"h1"}
        hidden={false}
      >
        {onlineStatus ? "Application online!" : "Application currently offline"}
      </Alert>
      <main>
        <RADForm />
      </main>
    </div>
  );
}

export default App;
