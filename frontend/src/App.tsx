/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./components/Routes.tsx";
import { ConfigProvider } from "./context/ConfigContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { AppLayout } from "./components/page/AppLayout.tsx";

function App() {
  return (
    <Router>
      <ConfigProvider>
        <AuthProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </AuthProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
