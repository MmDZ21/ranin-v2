"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { MessageSquare, User, Mail, Building, Phone, Send } from "lucide-react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
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
            ارسال پیام
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
                value={formData.name}
                onChange={handleInputChange}
                className="pr-10 rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
                placeholder="نام خود را وارد کنید"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              ایمیل *
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
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
              شماره تماس
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="text"
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
            موضوع *
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleInputChange}
            className="rounded-lg md:h-12 text-xs border-border placeholder:text-muted-foreground/50"
            placeholder="موضوع پیام خود را وارد کنید"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            پیام *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-4 rounded-lg text-xs md:text-sm border shadow-sm border-border placeholder:text-muted-foreground/50"
            placeholder="پیام خود را بنویسید..."
          />
        </div>
        
        <motion.div variants={variants.fadeInUp}>
          <Button type="submit" size="lg" className="w-full sm:w-auto rounded-lg">
            <Send className="w-4 h-4" />
            ارسال پیام
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
