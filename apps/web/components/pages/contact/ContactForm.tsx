"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import {
  MessageSquare,
  User,
  Mail,
  Building,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { createLead } from "@/actions/leads";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // The lead API only knows name/phone/email/message/source — fold the
    // form's extra company/subject fields into the message body so the
    // information isn't silently dropped (the API whitelists request body
    // properties and strips anything it doesn't recognize).
    const messageParts = [
      formData.company.trim() ? `شرکت: ${formData.company.trim()}` : null,
      formData.subject.trim() ? `موضوع: ${formData.subject.trim()}` : null,
      formData.message.trim() || null,
    ].filter((part): part is string => Boolean(part));

    startTransition(async () => {
      const result = await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: messageParts.length > 0 ? messageParts.join("\n\n") : undefined,
        source: "contact-form",
      });

      if (result.success) {
        setStatus({
          type: "success",
          message: "درخواست شما با موفقیت ثبت شد. تیم فروش برای پیگیری با شما تماس می‌گیرد.",
        });
        setFormData(initialFormData);
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  };

  return (
    <motion.div 
      ref={ref}
      className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl"
      initial="offscreen"
      animate={animate}
      variants={variants.scale}
    >
      <motion.div 
        className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        variants={variants.fadeInUp}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            ثبت درخواست استعلام
          </Heading>
        </div>
      </motion.div>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4 md:space-y-8"
        variants={variants.container}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              نام و نام خانوادگی *
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                maxLength={120}
                value={formData.name}
                onChange={handleInputChange}
                className="pr-10 rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
                placeholder="نام خود را وارد کنید"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              ایمیل
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                maxLength={160}
                value={formData.email}
                onChange={handleInputChange}
                className="pr-10 rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="company" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              نام شرکت
            </label>
            <div className="relative">
              <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className="pr-10 rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
                placeholder="نام شرکت خود را وارد کنید"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              شماره تماس *
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="text"
                required
                maxLength={40}
                value={formData.phone}
                onChange={handleInputChange}
                className="pr-10 rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
                placeholder="شماره تماس خود را وارد کنید"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            کد محصول یا موضوع درخواست
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            className="rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
            placeholder="برای نمونه: P3U20 یا استعلام رله حفاظت فیدر"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            مشخصات فنی و توضیحات
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-4 rounded-lg text-xs md:text-sm border shadow-sm border-border placeholder:text-muted-foreground/50"
            placeholder="تعداد، ولتاژ شبکه، کاربرد تجهیز و زمان موردنیاز را بنویسید"
          />
        </div>
        
        {status && (
          <motion.div
            role="status"
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-xs sm:text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{status.message}</span>
          </motion.div>
        )}

        <motion.div variants={variants.fadeInUp}>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full sm:w-auto rounded-lg"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isPending ? "در حال ارسال..." : "ارسال درخواست"}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
