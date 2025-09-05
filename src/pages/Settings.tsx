import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { supabase } from "@/supabase/client";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

const Settings = () => {
  const { profile } = useProfile() as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any;
    isProfileLoading: boolean;
  };
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
  });
  const [getImg, setGetImg] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        company: profile.company || "",
      });
    }
  }, [profile]);

  const updateProfile = useUpdateProfile();

  if (!profile) {
    return null;
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("userImages")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from("userImages").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleUpdate = async () => {
    let imageUrl: string | null = null;

    if (getImg) {
      imageUrl = await uploadImage(getImg);
    }

    updateProfile.mutate({
      userId: profile.user_id,
      userData: {
        name: profileData.name,
        company: profileData.company,
        ...(imageUrl ? { avatar_url: imageUrl } : {}),
      },
    });
  };

  return (
    <div>
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            الملف الشخصي <Camera />
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 text-2xl font-black rounded-full flex justify-center items-center bg-background">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} />
              ) : (
                <h2>{profile.name[0].toUpperCase()}</h2>
              )}
            </div>
            <div>
              <h3 className="font-bold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-muted-foreground">{profile.company}</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="mt-7"
          >
            <Label className="flex flex-col items-start">
              <span>تغيير صورة الملف الشخصي</span>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setGetImg(e.target.files[0]);
                  }
                }}
              />
            </Label>
            <div className="mt-5 flex flex-col sm:flex-row gap-7 items-center">
              <Label className="flex flex-col items-start flex-1">
                <span>الاسم</span>
                <Input
                  type="text"
                  dir="auto"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </Label>
              <Label className="flex flex-col items-start flex-1">
                <span>اسم المنشأة</span>
                <Input
                  type="text"
                  dir="auto"
                  value={profileData.company}
                  onChange={(e) =>
                    setProfileData({ ...profileData, company: e.target.value })
                  }
                />
              </Label>
            </div>
            <Button
              size="lg"
              className="mt-7"
              type="submit"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending
                ? "جاري حفظ البيانات..."
                : "حفظ البيانات"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
