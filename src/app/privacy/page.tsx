"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Lock, Database, UserCheck, Trash2, Share2, Server, Shield, User, Baby, RefreshCcw, Mail } from 'lucide-react';
import Link from 'next/link';

const Section = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-4 text-white">
      <div className="p-3 rounded-2xl bg-zinc-800/40">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-2xl font-black italic tracking-tight">{title}</h2>
    </div>
    <div className="text-zinc-400 leading-relaxed font-medium">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 pb-20">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-30 spotlight-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      
      <nav className="relative z-40 p-8 max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Security Verified</span>
        </div>
      </nav>

      <main className="relative z-30 max-w-4xl mx-auto px-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <header className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter text-white text-glow">Privacy Policy.</h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] opacity-60">시행일자: 2026년 4월 3일</p>
          </header>

          <div className="glass-card p-12 border border-white/5 bg-[#0d0d0d] rounded-[3rem] shadow-2xl space-y-20">
            
            <Section icon={Lock} title="1. 개요 (Overview)">
              본 서비스 "ThreadsRanks"(이하 "서비스")는 이용자의 개인정보를 중요하게 생각하며, 관련 법령(개인정보 보호법, GDPR 등)을 준수합니다. 본 개인정보처리방침은 사용자가 서비스를 이용할 때 어떤 정보가 수집되며, 어떻게 사용되고 보호되는지를 설명합니다.
            </Section>

            <Section icon={Database} title="2. 수집하는 정보 (Information We Collect)">
              <p className="mb-4">서비스는 Meta의 Threads API를 통해 다음 정보를 수집할 수 있습니다.</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold mb-2">2.1 계정 정보</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["Threads 사용자 ID", "프로필 이름 및 사용자명", "프로필 이미지 URL", "팔로워 수 및 계정 기본 정보"].map((item, i) => (
                      <li key={i} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">2.2 콘텐츠 및 활동 데이터</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["게시물 텍스트 및 게시 시간", "게시물 성과 데이터 (조회수, 좋아요, 리포스트, 인용, 댓글 수)"].map((item, i) => (
                      <li key={i} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">2.3 인증 정보</h3>
                  <p className="text-sm">• 액세스 토큰 (OAuth 인증을 통해 발급) <span className="text-rose-400">※ 비밀번호는 수집하지 않습니다.</span></p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">2.4 자동 수집 정보</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {["접속 로그", "서비스 이용 기록", "디바이스 및 브라우저 정보"].map((item, i) => (
                      <li key={i} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section icon={UserCheck} title="3. 개인정보 이용 목적 (How We Use Information)">
              <p className="mb-4">수집된 정보는 다음의 목적에 한해 사용됩니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Threads 계정 데이터 기반 성과 분석 대시보드 제공",
                  "게시물 참여도 지수(Engagement Score) 계산",
                  "최적의 게시 시간 분석 및 히트맵 제공",
                  "사용자 맞춤형 콘텐츠 인사이트 제공",
                  "서비스 개선 및 기능 개발",
                  "비정상 이용 방지 및 보안 강화"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold italic text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={Trash2} title="4. 개인정보 보관 및 삭제 (Data Retention & Deletion)">
              <ul className="space-y-4 text-sm">
                <li>• 사용자의 데이터는 서비스 제공 기간 동안 보관됩니다.</li>
                <li>• 사용자가 서비스 연결을 해제하거나 로그아웃할 경우 <strong>액세스 토큰은 즉시 폐기</strong>되며 관련 세션 데이터는 <strong>영구 삭제</strong>됩니다.</li>
                <li>• 사용자는 언제든지 Meta 계정 설정(앱 및 웹사이트 권한 제거) 혹은 서비스 내 계정 연결 해제 기능을 통해 데이터 삭제를 요청할 수 있습니다.</li>
              </ul>
            </Section>

            <Section icon={Share2} title="5. 개인정보 제3자 제공 (Third-Party Sharing)">
              서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, <strong>법령에 의한 요청</strong>이 있거나 <strong>이용자의 사전 동의</strong>를 받은 경우는 예외로 합니다.
            </Section>

            <Section icon={Server} title="6. 개인정보 처리 위탁 (Data Processing)">
              서비스는 원활한 운영을 위해 클라우드 서버(Google Cloud, Firebase, AWS 등) 및 데이터 분석 도구 등의 외부 서비스에 업무를 위탁할 수 있으며, 관련 법령에 따라 안전하게 관리됩니다.
            </Section>

            <Section icon={Shield} title="7. 데이터 보안 (Data Security)">
              서비스는 <strong>HTTPS 기반 데이터 전송 암호화</strong>, <strong>액세스 토큰 암호화 저장</strong>, <strong>인증 및 접근 제어 시스템 적용</strong> 등을 통해 개인정보 보호에 최선을 다하고 있습니다.
            </Section>

            <Section icon={User} title="8. 이용자의 권리 (User Rights)">
              이용자는 언제든지 자신의 개인정보에 대해 <strong>조회, 수정, 삭제 요청, 처리 제한 요청</strong> 등의 권리를 행사할 수 있습니다.
            </Section>

            <Section icon={Baby} title="9. 아동의 개인정보 보호 (Children’s Privacy)">
              본 서비스는 만 13세 미만 아동을 대상으로 하지 않으며, 해당 연령의 개인정보를 의도적으로 수집하지 않습니다.
            </Section>

            <Section icon={RefreshCcw} title="10. 정책 변경 (Changes to This Policy)">
              본 개인정보처리방침은 법령 및 서비스 변경에 따라 수정될 수 있습니다. 변경 시 서비스 내 공지사항 또는 웹페이지를 통해 안내됩니다.
            </Section>

            <Section icon={Mail} title="11. 문의처 (Contact)">
              <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 inline-block">
                <p className="text-zinc-300 font-bold mb-2">개인정보 관련 문의는 아래 이메일로 연락주시기 바랍니다.</p>
                <a href="mailto:monitoro@gmail.com" className="text-xl font-black italic text-emerald-400 hover:text-emerald-300 transition-colors">
                  monitoro@gmail.com
                </a>
              </div>
            </Section>

          </div>

          <footer className="pt-20 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-widest">ThreadsRanks © 2026. ALL RIGHTS RESERVED.</p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
