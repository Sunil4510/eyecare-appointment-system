/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { useState, type FC } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/shared";

const { Title, Text } = Typography;

const Login: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await login(values.email, values.password);
      if (user.role === UserRole.Optician) {
        navigate("/home");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    form.setFieldsValue({ email, password: pass });
    setErrorMessage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 p-4">
      <Card
        className="w-full max-w-md shadow-md rounded-xl border border-gray-200"
        styles={{ body: { padding: "32px 28px" } }}
      >
        <div className="text-center mb-6">
          <Title level={3} style={{ marginBottom: 4, fontWeight: 700 }}>
            Eye Care App
          </Title>
          <Text type="secondary">Sign in to book and manage appointments</Text>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => setErrorMessage(null)}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark="optional"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item className="mt-6 mb-3">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 font-medium"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Text type="secondary" className="block text-xs text-center mb-2 font-medium">
            Demo Credentials (Click to fill):
          </Text>
          <div className="flex gap-2 justify-center">
            <Button
              size="small"
              onClick={() => handleQuickFill("james@gmail.com", "james")}
            >
              Patient: James
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFill("mary@gmail.com", "mary")}
            >
              Optician: Mary
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;

