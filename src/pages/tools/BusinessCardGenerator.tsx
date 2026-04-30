import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, CreditCard } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Template = "minimal" | "gradient" | "corporate" | "dark";

const BusinessCardGenerator = () => {
  const [template, setTemplate] = useState<Template>("minimal");
  const [name, setName] = useState("Alex Morgan");
  const [title, setTitle] = useState("Product Designer");
  const [company, setCompany] = useState("Acme Studio");
  const [email, setEmail] = useState("alex@acme.com");
  const [phone, setPhone] = useState("+1 555 0100");
  const [website, setWebsite] = useState("acme.com");
  const [address, setAddress] = useState("San Francisco, CA");
  const [primary, setPrimary] = useState("#6366f1");
  const cardRef = useRef<HTMLDivElement>(null);

  const download = async (type: "pdf" | "png") => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 4, backgroundColor: null });
      if (type === "png") {
        const link = document.createElement("a");
        link.download = `${name.replace(/\s+/g, "_")}_card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const pdf = new jsPDF({ unit: "mm", format: [89, 51] }); // standard 3.5x2 in
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 89, 51);
        pdf.save(`${name.replace(/\s+/g, "_")}_card.pdf`);
      }
      toast.success("Downloaded");
    } catch { toast.error("Export failed"); }
  };

  const renderCard = () => {
    const base = "w-[350px] h-[200px] rounded-xl overflow-hidden relative";
    if (template === "minimal") return (
      <div className={`${base} bg-white shadow-2xl border`}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
          <div className="text-[10px] text-gray-700 space-y-0.5">
            <div className="font-semibold uppercase tracking-wider" style={{ color: primary }}>{company}</div>
            <div>{phone} · {email}</div>
            <div>{website} · {address}</div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-2" style={{ background: primary }} />
      </div>
    );
    if (template === "gradient") return (
      <div className={`${base} text-white shadow-2xl`} style={{ background: `linear-gradient(135deg, ${primary}, #1e1b4b)` }}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-2xl font-bold">{name}</div>
            <div className="text-sm opacity-90">{title}</div>
          </div>
          <div className="text-[10px] space-y-0.5">
            <div className="font-bold uppercase tracking-widest">{company}</div>
            <div>{phone} · {email}</div>
            <div>{website}</div>
          </div>
        </div>
      </div>
    );
    if (template === "corporate") return (
      <div className={`${base} bg-white shadow-2xl flex`}>
        <div className="w-1/3 flex items-center justify-center text-white text-3xl font-black" style={{ background: primary }}>
          {name.split(" ").map(s => s[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="text-lg font-bold">{name}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: primary }}>{title}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{company}</div>
          </div>
          <div className="text-[10px] text-gray-700 space-y-0.5 border-t pt-2">
            <div>📧 {email}</div><div>📞 {phone}</div><div>🌐 {website}</div>
          </div>
        </div>
      </div>
    );
    return (
      <div className={`${base} bg-gray-900 text-white shadow-2xl`}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-bold">{name}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{title}</div>
            </div>
            <div className="text-2xl font-black" style={{ color: primary }}>{company.split(" ").map(s => s[0]).join("").slice(0, 2)}</div>
          </div>
          <div className="text-[10px] text-gray-300 space-y-0.5">
            <div style={{ color: primary }} className="font-bold uppercase tracking-widest">{company}</div>
            <div>{phone} · {email}</div>
            <div>{website} · {address}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolPageTemplate title="Business Card Generator" description="Design professional business cards. Export as standard 3.5×2 inch PDF or high-res PNG." keywords="business card maker, visiting card design, PDF business card">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5" />Card Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Template</Label>
              <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal Clean</SelectItem>
                  <SelectItem value="gradient">Gradient Modern</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="dark">Dark Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Brand Color</Label><Input type="color" value={primary} onChange={e => setPrimary(e.target.value)} /></div>
            <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} /></div>
            <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div><Label>Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} /></div>
            <div className="col-span-2"><Label>Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => download("png")} variant="outline"><Download className="w-4 h-4 mr-2" />PNG</Button>
            <Button onClick={() => download("pdf")}><Download className="w-4 h-4 mr-2" />PDF (3.5×2 in)</Button>
          </div>
        </Card>
        <Card className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div ref={cardRef}>{renderCard()}</div>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default BusinessCardGenerator;
