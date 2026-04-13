import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-2 text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Shield className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Last updated: April 13, 2026</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            1. Information We Collect
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            At Creatify AI, we collect information to provide better services to our users. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Account Information:</strong> Name, email address, and profile picture provided via Google Login.</li>
            <li><strong>User Content:</strong> Prompts, uploaded images, and generated visual content stored in your projects.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our AI generation tools and templates.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            2. How We Use Your Information
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Your data is used to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Generate personalized AI content based on your prompts.</li>
            <li>Maintain your project library and account settings.</li>
            <li>Improve our AI models and user interface.</li>
            <li>Enforce our terms of service and prevent abuse.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            3. Data Security
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We use industry-standard security measures provided by Google Firebase to protect your data. Your visual content is stored securely, and access is restricted according to our strict security rules.
          </p>
        </section>

        <section className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            If you have any questions about this Privacy Policy, please contact us at support@creatify.ai
          </p>
        </section>
      </div>
    </div>
  );
}
