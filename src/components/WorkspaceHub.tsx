import React, { useState, useEffect } from "react";
import { 
  auth, 
  db, 
  googleSignIn, 
  logout, 
  initAuth, 
  getAccessToken,
  handleFirestoreError,
  OperationType
} from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { 
  Mail, 
  MessageSquare, 
  HardDrive, 
  Send, 
  Trash2, 
  Plus, 
  RefreshCw, 
  UserCheck, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Loader2, 
  LogOut, 
  FileText, 
  Inbox, 
  AlertCircle 
} from "lucide-react";
import { UserProfile } from "../types";
import { TEAMS } from "../data/worldCupData";

type SubSection = "gmail" | "chat" | "drive" | "firebase";

export default function WorkspaceHub() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSub, setActiveSub] = useState<SubSection>("gmail");
  
  // Sync Profile with Firestore
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileMsg, setProfileMsg] = useState<string>("");

  // Gmail State
  const [emails, setEmails] = useState<any[]>([]);
  const [emailsLoading, setEmailsLoading] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emailTo, setEmailTo] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [gmailError, setGmailError] = useState<string>("");

  // Google Chat State
  const [spaces, setSpaces] = useState<any[]>([]);
  const [spacesLoading, setSpacesLoading] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [newChatText, setNewChatText] = useState<string>("");
  const [sendingChatMessage, setSendingChatMessage] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string>("");

  // Google Drive State
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [creatingFile, setCreatingFile] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string>("");

  // Generic Confirmation modal
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  // Initialize Auth listeners
  useEffect(() => {
    const unsub = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setLoading(false);
        syncUserProfile(currentUser);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Fetch data depending on active tab
  useEffect(() => {
    if (accessToken) {
      if (activeSub === "gmail") fetchEmails();
      if (activeSub === "chat") fetchSpaces();
      if (activeSub === "drive") fetchFiles();
    }
  }, [accessToken, activeSub]);

  // Sync user logging profiles securely with Firestore (Fulfills adding Firebase requirement)
  const syncUserProfile = async (currentUser: any) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data() as UserProfile);
      } else {
        // Create initial profile in Firestore
        const newProfile: UserProfile = {
          username: currentUser.displayName || "مشجع المونديال المتصل",
          email: currentUser.email || "",
          favoriteTeamId: "bra",
          favoriteTeamName: "🇧🇷 البرازيل",
          avatar: "⚽",
          xp: 100,
          badge: "مبتدئ المونديال",
          isPremium: false,
          joinedAt: new Date().toLocaleDateString("ar-SA")
        };
        await setDoc(userRef, {
          userId: currentUser.uid,
          ...newProfile
        });
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Firestore sync error: ", err);
      // Fallback local display
      setProfile({
        username: currentUser.displayName || "مشجع المونديال المتصل",
        email: currentUser.email || "",
        favoriteTeamId: "bra",
        favoriteTeamName: "🇧🇷 البرازيل",
        avatar: "⚽",
        xp: 100,
        badge: "مبتدئ المونديال",
        isPremium: false,
        joinedAt: new Date().toLocaleDateString("ar-SA")
      });
    }
  };

  const handleUpdateFavoriteTeam = async (teamId: string) => {
    if (!user || !profile) return;
    setSavingProfile(true);
    setProfileMsg("");
    const selectedTeam = TEAMS.find(t => t.id === teamId);
    const teamName = selectedTeam ? `${selectedTeam.flag} ${selectedTeam.name}` : "🇧🇷 البرازيل";
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favoriteTeamId: teamId,
        favoriteTeamName: teamName
      });
      const updated = { ...profile, favoriteTeamId: teamId, favoriteTeamName: teamName };
      setProfile(updated);
      localStorage.setItem("worldcup_user_profile", JSON.stringify(updated));
      setProfileMsg("تم تحديث منتخبك المفضل في قاعدة البيانات السحابية (Firebase) بنجاح! 💾✨");
      setTimeout(() => setProfileMsg(""), 5000);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      } catch (err: any) {
        setProfileMsg(`خطأ: ${err.message}`);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        await syncUserProfile(result.user);
      }
    } catch (err: any) {
      console.error("Google SSO Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setProfile(null);
  };

  // ---------------------------------------------------------------------------
  // GMAIL API INTEGRATION
  // ---------------------------------------------------------------------------
  const fetchEmails = async () => {
    if (!accessToken) return;
    setEmailsLoading(true);
    setGmailError("");
    try {
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`Gmail API returned status ${res.status}`);
      const data = await res.json();
      
      const emailItems = data.messages || [];
      const detailedEmails = await Promise.all(
        emailItems.map(async (msg: any) => {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=minimal`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          return detailRes.ok ? await detailRes.json() : msg;
        })
      );
      setEmails(detailedEmails);
    } catch (error: any) {
      console.error("Fetch Emails error:", error);
      setGmailError("تعذر تصفح الرسائل حالياً، قد يكون صندوق الوارد المرفق غير مهيأ بعد.");
    } finally {
      setEmailsLoading(false);
    }
  };

  const executeSendEmail = async () => {
    if (!accessToken || !emailTo || !emailSubject || !emailBody) return;
    setSendingEmail(true);
    setGmailError("");
    try {
      // Create simple RFC 822/2822 formatting
      const mailString = [
        `To: ${emailTo}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(emailSubject)))}?=`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        emailBody
      ].join('\r\n');

      const encodedMail = btoa(unescape(encodeURIComponent(mailString)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: encodedMail })
      });

      if (!res.ok) throw new Error(`Gmail API returned status ${res.status}`);
      
      setEmailTo("");
      setEmailSubject("");
      setEmailBody("");
      alert("تم إرسال البريد الإلكتروني بنجاح! ✉️🚀");
      fetchEmails();
    } catch (err: any) {
      console.error("Send Email Error:", err);
      setGmailError("فشل في إرسال البريد - يرجى مراجعة بريد المستلم.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendEmail = () => {
    if (!emailTo || !emailSubject || !emailBody) {
      alert("الرجاء ملء كافة الحقول لإرسال البريد.");
      return;
    }
    // Strict requirement: User confirmation dialog for sending emails
    setConfirmDialog({
      show: true,
      title: "تأكيد إرسال البريد الإلكتروني",
      message: `هل أنت متأكد من رغبتك في إرسال البريد الإلكتروني إلى ${emailTo} بعنوان "${emailSubject}"؟`,
      action: executeSendEmail
    });
  };

  // ---------------------------------------------------------------------------
  // GOOGLE CHAT API INTEGRATION
  // ---------------------------------------------------------------------------
  const fetchSpaces = async () => {
    if (!accessToken) return;
    setSpacesLoading(true);
    setChatError("");
    try {
      const res = await fetch("https://chat.googleapis.com/v1/spaces", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`Chat API status ${res.status}`);
      const data = await res.json();
      setSpaces(data.spaces || []);
    } catch (err: any) {
      console.error("Fetch Spaces Error:", err);
      setChatError("تعذر تحميل غرف المحادثة. قد تحتاج الميزة لمساحة عمل Google Workspace نشطة بالكامل.");
    } finally {
      setSpacesLoading(false);
    }
  };

  const fetchSpaceMessages = async (spaceId: string) => {
    if (!accessToken) return;
    setMessagesLoading(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${spaceId}/messages?pageSize=15`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const executeSendChatMessage = async () => {
    if (!accessToken || !selectedSpace || !newChatText.trim()) return;
    setSendingChatMessage(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: newChatText })
      });
      if (!res.ok) throw new Error(`Chat API status ${res.status}`);
      setNewChatText("");
      fetchSpaceMessages(selectedSpace.name);
    } catch (err) {
      console.error("Send Chat Error:", err);
      alert("فشل إرسال رسالة الدردشة.");
    } finally {
      setSendingChatMessage(false);
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatText.trim()) return;
    // Strict requirement: User confirmation dialog for sending chat messages
    setConfirmDialog({
      show: true,
      title: "تأكيد إرسال رسالة دردشة",
      message: `هل تريد إرسال هاته الرسالة "${newChatText}" إلى غرفة "${selectedSpace.displayName || selectedSpace.name}"؟`,
      action: executeSendChatMessage
    });
  };

  // ---------------------------------------------------------------------------
  // GOOGLE DRIVE API INTEGRATION
  // ---------------------------------------------------------------------------
  const fetchFiles = async () => {
    if (!accessToken) return;
    setFilesLoading(true);
    setDriveError("");
    try {
      const res = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,size,createdTime)", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`Drive API status ${res.status}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error("Fetch files error:", err);
      setDriveError("تعذر جلب ملفات Google Drive.");
    } finally {
      setFilesLoading(false);
    }
  };

  const executeCreateFile = async () => {
    if (!accessToken || !newFileName) return;
    setCreatingFile(true);
    try {
      // Simple metadata POST flow
      const res = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newFileName.endsWith(".txt") ? newFileName : `${newFileName}.txt`,
          mimeType: "text/plain"
        })
      });
      if (!res.ok) throw new Error(`Drive File Create status ${res.status}`);
      setNewFileName("");
      setNewFileContent("");
      alert("تم إنشاء الملف النصي في سحابة Drive بنجاح! 📁🎉");
      fetchFiles();
    } catch (err) {
      console.error("Create File error:", err);
      alert("حدث خطأ أثناء إنشاء الفيل.");
    } finally {
      setCreatingFile(false);
    }
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      alert("يرجى إدخال اسم ملف صالح.");
      return;
    }
    // Strict requirement: User confirmation dialog for modifying/creating user files
    setConfirmDialog({
      show: true,
      title: "تأكيد إنشاء ملف درايف",
      message: `هل أنت موافق على إنشاء ملف نصي جديد باسم "${newFileName}" وتثبيته في سحابة Google Drive الخاصة بك؟`,
      action: executeCreateFile
    });
  };

  const executeDeleteFile = async (fileId: string, fileName: string) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`Delete failed with ${res.status}`);
      alert(`تم حذف الملف "${fileName}" من Google Drive بنجاح! 🗑️`);
      fetchFiles();
    } catch (err) {
      console.error("Delete File error: ", err);
      alert("فشل حذف الملف.");
    }
  };

  const handleDeleteFile = (fileId: string, fileName: string) => {
    // Strict requirement: User confirmation dialog for deleting files
    setConfirmDialog({
      show: true,
      title: "حذف ملف من Google Drive",
      message: `تحذير: هل أنت متأكد تماماً من رغبتك في حذف ملف "${fileName}" نهائياً؟ لا يمكن استرجاع هذا الملف بعد حذفه.`,
      action: () => executeDeleteFile(fileId, fileName)
    });
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-950 text-slate-100 min-h-[500px]">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-sans">جاري فحص وتجهيز بوابات Google Workspace & Firebase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-right" id="workspace-hub-root">
      
      {/* ⚠️ Confirmation Dialog UI (Strict compliance with guidelines) */}
      {confirmDialog && confirmDialog.show && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-end gap-2.5 text-rose-400 font-semibold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>تـأكـيـد الإجراء الحساس (Workspace)</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed font-sans">{confirmDialog.message}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                onClick={async () => {
                  const act = confirmDialog.action;
                  setConfirmDialog(null);
                  await act();
                }}
              >
                تأكيد ومتابعة الإجراء
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs border border-slate-850 transition-colors cursor-pointer"
                onClick={() => setConfirmDialog(null)}
              >
                إلغاء الإجراء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HUB HEADER */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/25 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6">
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 p-[1.5px] shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              ☁️
            </div>
          </div>

          <div className="text-center md:text-right flex-1 space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold py-0.5 px-3 rounded-full border border-blue-500/15">
              <span>دمج Google Workspace & Firebase</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-2xl font-black text-white">الملف الموحد وبوابة الخدمات المتكاملة</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-sans">
              واجهة متطورة تمكنك من جلب رسائل بريدك (Gmail) وإرسال المراسلات، وتفتيش غرف المحادثات (Google Chat)، ومزامنة وتحميل مستنداتك وسجلات توقعاتك على سحابة (Google Drive) مباشرة، مع ربط كامل لبياناتك الشخصية بقاعدة Firebase Firestore.
            </p>
          </div>
        </div>
      </div>

      {/* BEFORE SIGN IN INTERFACE */}
      {!user ? (
        <div className="max-w-xl mx-auto bg-slate-950/80 border border-slate-900 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <div className="w-16 h-16 bg-blue-500/15 border border-blue-500/25 rounded-2xl flex items-center justify-center mx-auto text-3xl animate-pulse">
            🔑
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-extrabold text-base">يرجى تسجيل الدخول بحساب Google</h3>
            <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              لتمكين خدمات Gmail المتكاملة، وتفقد غرف Google Chat بمونديال 2026، وإدارة ملفات Drive بسلاسة مع تشفير Firebase Firestore.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            {/* OFFICIAL GSI MATERIAL BUTTON */}
            <button 
              type="button"
              onClick={handleLogin}
              className="px-6 py-3.5 bg-white text-slate-900 font-extrabold rounded-2xl transition-all shadow-lg hover:bg-slate-50 cursor-pointer flex items-center gap-3 active:scale-95 border border-slate-200 select-none text-xs"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>تسجيل الدخول الفوري عن طريق Google 🚀</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-sans leading-relaxed pt-2">
            * يتم حفظ وحماية بياناتك والتشفير طبقاً لشروط وأحكام الأمان لـ Firebase و Google OAuth API. "مساحة آمنة للغاية".
          </div>
        </div>
      ) : (
        /* AFTER SIGN IN */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* NAVIGATION SIDEBAR */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 space-y-4 text-right">
            
            <div className="flex items-center gap-3 p-2.5 bg-slate-900 rounded-2xl border border-slate-850">
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl"
              />
              <div className="text-right">
                <h4 className="text-xs font-black text-white">{user.displayName || "مطور مونديال"}</h4>
                <p className="text-[10px] text-slate-400 font-mono select-all truncate max-w-[130px]">{user.email}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              
              <button
                type="button"
                className={`w-full px-4 h-11 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                  activeSub === "gmail" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
                onClick={() => setActiveSub("gmail")}
              >
                <Mail className="w-4.5 h-4.5" />
                <span>البريد الإلكتروني (Gmail)</span>
              </button>

              <button
                type="button"
                className={`w-full px-4 h-11 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                  activeSub === "chat" 
                    ? "bg-cyan-600 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
                onClick={() => setActiveSub("chat")}
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>محادثات المونديال (Chat)</span>
              </button>

              <button
                type="button"
                className={`w-full px-4 h-11 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                  activeSub === "drive" 
                    ? "bg-emerald-600 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
                onClick={() => setActiveSub("drive")}
              >
                <HardDrive className="w-4.5 h-4.5" />
                <span>ملفات درايف السحابية (Drive)</span>
              </button>

              <button
                type="button"
                className={`w-full px-4 h-11 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer select-none ${
                  activeSub === "firebase" 
                    ? "bg-amber-600 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
                onClick={() => setActiveSub("firebase")}
              >
                <UserCheck className="w-4.5 h-4.5" />
                <span>المزامنة والملف (Firebase)</span>
              </button>

            </div>

            <div className="pt-4 border-t border-slate-900">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-11 bg-red-950/20 text-rose-400 border border-red-500/10 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

          </div>

          {/* ACTIVE SUBSECTION WORKSPACE PANEL */}
          <div className="lg:col-span-3 bg-slate-950/80 border border-slate-900 rounded-3xl p-6 min-h-[450px] relative text-right">
            
            {/* 1. GMAIL SECTION PANEL */}
            {activeSub === "gmail" && (
              <div className="space-y-6 animate-fade-in">
                
                <h3 className="text-base font-black text-white flex items-center justify-end gap-2 border-b border-slate-900 pb-3">
                  <span>صندوق الرسائل والمراسلة (Gmail API)</span>
                  <Mail className="w-5 h-5 text-blue-400" />
                </h3>

                {gmailError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/15 text-red-400 rounded-xl text-xs font-sans">
                    ⚠️ {gmailError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: List details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-850">
                      <button
                        type="button"
                        onClick={fetchEmails}
                        disabled={emailsLoading}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        title="تحديث الرسائل"
                      >
                        <RefreshCw className={`w-4 h-4 ${emailsLoading ? "animate-spin" : ""}`} />
                      </button>
                      <span className="text-xs text-slate-300 font-bold">آخر الرسائل الواردة</span>
                    </div>

                    {emailsLoading ? (
                      <div className="text-center py-10 space-y-2">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                        <p className="text-[11px] text-slate-500 font-sans">جاري تحميل رسائل الوارد...</p>
                      </div>
                    ) : emails.length === 0 ? (
                      <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-900">
                        <Inbox className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-sans">لم نجد رسائل بريدية نشطة!</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {emails.map((msg) => {
                          const snippet = msg.snippet || "بلا محتوى نصي بارز.";
                          const subjectHeader = msg.payload?.headers?.find((h: any) => h.name.toLowerCase() === "subject");
                          const fromHeader = msg.payload?.headers?.find((h: any) => h.name.toLowerCase() === "from");
                          const subject = subjectHeader ? subjectHeader.value : "بدون موضوع";
                          const sender = fromHeader ? fromHeader.value : "العنوان غير معروف";

                          return (
                            <button
                              key={msg.id}
                              type="button"
                              onClick={() => setSelectedEmail(msg)}
                              className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer font-sans ${
                                selectedEmail?.id === msg.id 
                                  ? "bg-blue-600/10 border-blue-500/40" 
                                  : "bg-slate-900/60 border-slate-900 hover:bg-slate-900"
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{sender}</span>
                                <span className="font-bold text-slate-200 truncate pr-2">{subject}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate w-full pl-2 font-sans">{snippet}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {selectedEmail && (
                      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850 space-y-2 animate-fade-in">
                        <h4 className="font-bold text-xs text-slate-200">عرض تفاصيل الرسالة :</h4>
                        <div className="text-[11px] text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-[150px] overflow-y-auto">
                          {selectedEmail.snippet}
                        </div>
                        <button
                          type="button"
                          className="text-[10px] text-slate-500 hover:text-white transition-all underline"
                          onClick={() => setSelectedEmail(null)}
                        >
                          إغلاق عرض التفاصيل
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Draft Mail */}
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-900 space-y-4">
                    <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                      <span>إرسال بريد رسمي جديد</span>
                      <Send className="w-3.5 h-3.5 text-blue-400" />
                    </h4>

                    <div className="space-y-2.5 text-right">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">بريد المستلم الأصلي :</label>
                        <input
                          type="email"
                          required
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          placeholder="recipient@example.com"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 text-[11px] font-mono text-left"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">عنوان الرسالة (الموضوع) :</label>
                        <input
                          type="text"
                          required
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="أدخل موضوع الرسالة هنا..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 text-[11px] font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">محتوى البريد النصي :</label>
                        <textarea
                          rows={4}
                          required
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="اكتب رسالتك وتوقعاتك لمونديال كأس العالم ٢٠٢٦..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 text-[11px] font-sans h-24 whitespace-pre-wrap"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={sendingEmail}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {sendingEmail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>مراجعة وأرسل البريد الإلكتروني 🚀</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* 2. GOOGLE CHAT SECTION PANEL */}
            {activeSub === "chat" && (
              <div className="space-y-6 animate-fade-in">
                
                <h3 className="text-base font-black text-white flex items-center justify-end gap-2 border-b border-slate-900 pb-3">
                  <span>مساحات وغرف محادثات Google Chat API</span>
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </h3>

                {chatError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/15 text-red-100 rounded-xl text-xs font-sans">
                    ⚠️ {chatError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Spaces column list */}
                  <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-900 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <button
                        type="button"
                        onClick={fetchSpaces}
                        disabled={spacesLoading}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="تحديث الغرف"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${spacesLoading ? "animate-spin" : ""}`} />
                      </button>
                      <span>المساحات النشطة</span>
                    </div>

                    {spacesLoading ? (
                      <div className="text-center py-6">
                        <Loader2 className="w-5 h-5 text-cyan-500 animate-spin mx-auto mb-1" />
                        <span className="text-[10px] text-slate-500 font-sans">جاري تحميل الغرف...</span>
                      </div>
                    ) : spaces.length === 0 ? (
                      <div className="text-center py-8 space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-900">
                        <p className="text-[11px] text-slate-400 font-sans">لا توجد مساحات نشطة حالياً.</p>
                        <p className="text-[9.5px] text-slate-500 font-sans font-normal leading-relaxed">
                          يتطلب ذلك تهيئة حساب Google Workspace المؤسسي لإنشاء مساحات دردشة رسمية للموظفين لربطها.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {spaces.map((sp) => (
                          <button
                            key={sp.name}
                            type="button"
                            onClick={() => {
                              setSelectedSpace(sp);
                              fetchSpaceMessages(sp.name);
                            }}
                            className={`w-full text-right p-2 rounded-xl text-xs font-sans border transition-all truncate block cursor-pointer ${
                              selectedSpace?.name === sp.name 
                                ? "bg-cyan-600/15 border-cyan-500/40 text-cyan-400 font-bold" 
                                : "bg-slate-900 border-transparent text-slate-300 hover:bg-slate-850"
                            }`}
                          >
                            # {sp.displayName || sp.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message thread details */}
                  <div className="md:col-span-2 bg-slate-900/20 rounded-2xl border border-slate-900 p-4 space-y-4 flex flex-col justify-between min-h-[300px]">
                    
                    <div>
                      <h4 className="text-xs font-black text-white pb-2 border-b border-slate-900">
                        {selectedSpace ? (
                          <span>قناة المحادثة المفتوحة: #{selectedSpace.displayName || selectedSpace.name}</span>
                        ) : (
                          <span className="text-slate-500 font-normal">اختيار مساحة لبدء قراءة سجل المراسلات المباشرة</span>
                        )}
                      </h4>

                      {selectedSpace ? (
                        <div className="py-2">
                          {messagesLoading ? (
                            <div className="text-center py-10">
                              <Loader2 className="w-5 h-5 text-cyan-500 animate-spin mx-auto mb-1" />
                              <span className="text-[10px] text-slate-500 font-sans">جاري سحب المراسلات المباشرة...</span>
                            </div>
                          ) : chatMessages.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-slate-850 p-3">
                              <p className="text-xs text-slate-400 font-sans">لا توجد رسائل سابقة في هذه المساحة بعد.</p>
                              <p className="text-[10px] text-slate-500 mt-1 font-sans">اكتب رسالتك أدناه لإرسال التوقع الحماسي!</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                              {chatMessages.map((m, idx) => (
                                <div key={m.name || idx} className="p-2 bg-slate-900 rounded-xl border border-slate-850/60 font-sans text-[11px]">
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans mb-1">
                                    <span>{m.sender?.displayName || "مشجع مجهول"}</span>
                                    <span>{m.createTime ? new Date(m.createTime).toLocaleTimeString("ar-SA") : ""}</span>
                                  </div>
                                  <p className="text-slate-200">{m.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-14 space-y-4">
                          <p className="text-xs text-slate-400 font-sans">مستكشف غرف Google Chat جاهز.</p>
                          <div className="text-[10.5px] max-w-sm mx-auto bg-slate-900/50 p-3.5 rounded-2xl text-slate-500 text-center font-sans space-y-1 border border-slate-900">
                            <strong>شرح المطور ⚙️:</strong>
                            <p className="leading-relaxed">
                              تم تفعيل صلاحيات `chat.messages` و `chat.spaces.readonly`. يرجى ربط حساب مطور مساحة عمل للتفاعل مباشرة وإرسال رسائل ذكية.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Text Input */}
                    {selectedSpace && (
                      <div className="space-y-3 pt-3 border-t border-slate-900">
                        <textarea
                          rows={2}
                          value={newChatText}
                          onChange={(e) => setNewChatText(e.target.value)}
                          placeholder="اكتب رسالتك للمساحة هنا..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-cyan-500 text-[11px] font-sans text-right placeholder-slate-600 resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleSendChatMessage}
                          disabled={sendingChatMessage || !newChatText.trim()}
                          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {sendingChatMessage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>مراجعة وأرسل رسالة Chat للغرفة 💬</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* 3. GOOGLE DRIVE SECTION PANEL */}
            {activeSub === "drive" && (
              <div className="space-y-6 animate-fade-in">
                
                <h3 className="text-base font-black text-white flex items-center justify-end gap-2 border-b border-slate-900 pb-3">
                  <span>إدارة المستندات المونديالية وسحابة Google Drive</span>
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </h3>

                {driveError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/15 text-red-100 rounded-xl text-xs font-sans">
                    ⚠️ {driveError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Create New File form */}
                  <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-900 space-y-4 h-full">
                    <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                      <span>إنشاء مذكرة مونديالية بالدرايف</span>
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-sans">عنوان أو اسم المذكرة (.txt) :</label>
                        <input
                          type="text"
                          required
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          placeholder="مثال: توقعات_ربع_النهائي"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 text-[11px] font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-sans">نصوص وملاحظات المذكرة :</label>
                        <textarea
                          rows={4}
                          value={newFileContent}
                          onChange={(e) => setNewFileContent(e.target.value)}
                          placeholder="اكتب تحليلات لمنتخبات أو تعليقات على ملعب ميتلايف..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 text-[11px] font-sans h-20"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateFile}
                        disabled={creatingFile || !newFileName}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {creatingFile ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>تأكيد جلب وإنشاء ملف درايف! 📁</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Drive Files table */}
                  <div className="md:col-span-2 bg-slate-900/20 rounded-3xl border border-slate-900 p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <button
                        type="button"
                        onClick={fetchFiles}
                        disabled={filesLoading}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="تحديث ملفات درايف"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${filesLoading ? "animate-spin" : ""}`} />
                      </button>
                      <span>ملفات وسجلات Drive الحالية</span>
                    </div>

                    {filesLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-1" />
                        <span className="text-[11px] text-slate-500 font-sans">جاري سحب قائمة السجلات السحابية...</span>
                      </div>
                    ) : files.length === 0 ? (
                      <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-850">
                        <FileText className="w-10 h-10 text-slate-750 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-sans">لا توجد ملفات متوفرة في مساحتك السحابية حتى الآن.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-right text-[11px] font-sans">
                          <thead>
                            <tr className="border-b border-slate-900 text-slate-400 text-[10px] font-bold">
                              <th className="pb-2 text-left">التصرف الحساس</th>
                              <th className="pb-2">نوع الملف</th>
                              <th className="pb-2">حجم الملف</th>
                              <th className="pb-2">اسم الملف السحابي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {files.map((file) => (
                              <tr key={file.id} className="border-b border-slate-900 hover:bg-slate-900/50 transition-colors">
                                <td className="py-2.5 text-left">
                                  {/* Delete file option with strictly mandated confirmation popup */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFile(file.id, file.name)}
                                    className="p-1 bg-red-950/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-red-500/10 rounded-lg cursor-pointer transition-all"
                                    title="حذف الملف نهائياً من درايف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                                <td className="py-2.5 text-slate-400 truncate max-w-[120px]" title={file.mimeType}>
                                  {file.mimeType?.replace("application/", "").replace("text/", "") || "سجل عام"}
                                </td>
                                <td className="py-2.5 font-mono text-slate-400">
                                  {file.size ? `${(parseFloat(file.size) / 1024).toFixed(1)} KB` : "غير محدد"}
                                </td>
                                <td className="py-2.5 font-bold text-slate-200 max-w-[150px] truncate" title={file.name}>
                                  {file.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 4. FIREBASE SYNCHRONIZER SECTION PANEL */}
            {activeSub === "firebase" && (
              <div className="space-y-6 animate-fade-in">
                
                <h3 className="text-base font-black text-white flex items-center justify-end gap-2 border-b border-slate-900 pb-3">
                  <span>مزامنة Firebase Firestore والموقع الشخصي الأصلي</span>
                  <UserCheck className="w-5 h-5 text-amber-500" />
                </h3>

                {profileMsg && (
                  <div className="p-3 bg-amber-500/15 border border-amber-500/25 text-amber-300 rounded-xl text-xs font-sans">
                    {profileMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Database profile display card */}
                  <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5 font-sans">
                      <span>بيانات السجل النشط بالمخدم السحابي</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h4>

                    {profile ? (
                      <div className="space-y-3 font-sans text-xs">
                        
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="font-mono text-slate-400 select-all truncate max-w-[150px]">{user.uid}</span>
                          <span className="text-slate-500">معرّف المخدم السحابي (UID)</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="text-slate-200 font-bold">{profile.username}</span>
                          <span className="text-slate-500">اسم المشجع المعتمد</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="font-mono text-slate-200">{profile.email}</span>
                          <span className="text-slate-500">البريد المعتمد الإلكتروني</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="text-emerald-400 font-bold">{profile.favoriteTeamName}</span>
                          <span className="text-slate-500">المنتخب المفضل سحابياً</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="text-amber-400 font-bold">{profile.badge}</span>
                          <span className="text-slate-500">badge / لقب الخبراء</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-mono text-sky-400 font-bold">{profile.xp} XP</span>
                          <span className="text-slate-500">قوة التوقع (نقاط الخبرة)</span>
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-sans">جاري استرجاع بياناتك من السحابة...</p>
                      </div>
                    )}
                  </div>

                  {/* Change favor team sync panel */}
                  {profile && (
                    <div className="bg-slate-900 p-5 rounded-3xl space-y-4">
                      <h4 className="text-xs font-bold text-slate-300">مزامنة تكتيكية وتعديل البيانات</h4>
                      
                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          بإمكانك تغيير منتخبك المفضل في مونديال 2026 هنا مباشرة. وسيتم مزامنة وتحديث حقل الـ `favoriteTeamName` والـ `favoriteTeamId` بشكل آمن ومحكم على مخدمات Firebase Firestore في الوقت الحقيقي.
                        </p>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1.5 font-sans">اختيار منتخبك المفضل المتوقع :</label>
                          <select
                            value={profile.favoriteTeamId}
                            onChange={(e) => handleUpdateFavoriteTeam(e.target.value)}
                            disabled={savingProfile}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-xs font-sans text-right text-slate-100 placeholder:text-slate-600"
                          >
                            {TEAMS.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.flag} {team.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {savingProfile && (
                          <div className="flex items-center gap-2 justify-end text-[10px] text-amber-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>جاري معالجة الكود والمزامنة بالخادم...</span>
                          </div>
                        )}

                        <div className="bg-slate-950/80 p-3 rounded-2xl text-[9.5px] text-slate-500 leading-normal font-sans border border-slate-900">
                          <strong>مؤشرات الأمان 🛡️:</strong> قواعد حماية سحابة Firestore صممت بحيث تمنع أي شخص أو زائر خارجي من تعديل أو حقن أي حقل مستعار في مستندك الخاص دون التحقق من الـ UID الخاص بك من المصادقة الرسمية Google OAuth.
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
