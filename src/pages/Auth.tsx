import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("omr222000@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const { signIn, signUp, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await signUp(email, password, name, company);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-background">
        <h1 className="w-full h-screen">جاري التحميل...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-lg sm:text-3xl mb-1 font-bold text-foreground">
            لوحة تحكم المخزن
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground">
            سجل دخولك لإدارة المنتجات
          </p>
        </div>
        <Tabs defaultValue="signIn" className="space-y-4" dir="rtl">
          <TabsList className="w-full grid grid-cols-2 bg-white">
            <TabsTrigger value="signIn">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signUp">إنشاء حساب</TabsTrigger>
          </TabsList>
          <TabsContent value="signIn">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>تسجيل الدخول</CardTitle>
                <CardDescription>
                  أدخل بياناتك لتسجيل الدخول إلى لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-6">
                  <label htmlFor="email" className="block">
                    <span className="text-sm font-medium block mb-2">
                      البريد الإلكتروني
                    </span>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ادخل بريدك الإلكتروني"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label htmlFor="password" className="block">
                    <span className="text-sm font-medium block mb-2">
                      كلمة المرور
                    </span>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="ادخل كلمة المرور"
                      required
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <Button type="submit" className="w-full">
                    تسجيل الدخول
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signUp">
            <Card className="p-6">
              <CardHeader className="mb-4">
                <CardTitle>إنشاء حساب جديد</CardTitle>
                <CardDescription>
                  أنشئ حساباً جديداً للوصول إلى لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-6">
                  <label htmlFor="name" className="block">
                    <span className="text-sm font-medium block mb-2">
                      اسم المستخدم
                    </span>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="ادخل اسم المستخدم"
                      required
                      dir="ltr"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label htmlFor="company" className="block">
                    <span className="text-sm font-medium block mb-2">
                      اسم المنشأة
                    </span>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="ادخل اسم المنشأة"
                      required
                      dir="ltr"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </label>
                  <label htmlFor="email" className="block">
                    <span className="text-sm font-medium block mb-2">
                      البريد الإلكتروني
                    </span>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ادخل بريدك الإلكتروني"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label htmlFor="password" className="block">
                    <span className="text-sm font-medium block mb-2">
                      كلمة المرور
                    </span>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="ادخل كلمة المرور"
                      required
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <Button type="submit" className="w-full">
                    إنشاء الحساب
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
