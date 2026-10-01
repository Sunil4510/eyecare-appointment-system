/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { MenuProps } from "antd";
import { Layout, Menu, Tag } from "antd";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/shared";

const { Header, Content } = Layout;

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  // Redirect unauthenticated user to login
  useEffect(() => {
    if (!user && !isLoginPage) {
      navigate("/login");
    }
  }, [user, isLoginPage, navigate]);

  const items: MenuProps["items"] = useMemo(() => {
    if (user?.role === UserRole.Optician) {
      return [
        { label: "Schedule", key: "/home" },
        { label: "Shared Components", key: "/shared-components" },
        { label: "Logout", key: "logout" },
      ];
    }

    return [
      { label: "Home", key: "/home" },
      { label: "Catalogue", key: "/catalogue" },
      { label: "Shared Components", key: "/shared-components" },
      { label: "Logout", key: "logout" },
    ];
  }, [user?.role]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(e.key);
    }
  };

  const selectedKey = useMemo(() => {
    if (location.pathname === "/" || location.pathname === "/home") return "/home";
    return location.pathname;
  }, [location.pathname]);

  return !isLoginPage ? (
    <Layout className="bg-slate-50 min-h-screen">
      <Header className="flex items-center justify-between px-6 bg-slate-900 shadow">
        <div className="flex items-center gap-6 flex-1">
          <div
            className="text-white font-bold text-lg cursor-pointer tracking-tight"
            onClick={() => navigate("/home")}
          >
            EyeCare Clinic
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={items}
            onClick={handleMenuClick}
            className="bg-transparent border-0 flex-1"
          />
        </div>
        {user && (
          <div className="flex items-center gap-3 text-white text-sm">
            <span className="font-medium text-slate-200">
              {user.first_name} {user.last_name}
            </span>
            <Tag color={user.role === UserRole.Optician ? "cyan" : "blue"}>
              {user.role === UserRole.Optician ? "Optician" : "Patient"}
            </Tag>
          </div>
        )}
      </Header>
      <Content className="p-6 min-h-[calc(100vh-64px)] max-w-7xl w-full mx-auto">
        {children}
      </Content>
    </Layout>
  ) : (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-50">
      {children}
    </div>
  );
};

