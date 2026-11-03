import React, { useEffect, useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  QrCode,
  Copy,
  Wifi,
  Sparkles,
} from 'lucide-react';
// import QRCode from 'qrcode';
import { ThemeMode } from '../types/criminal';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  deferredPrompt: any;
  onInstallClick: () => void;
  isStandalone: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  deferredPrompt,
  onInstallClick,
  isStandalone,
}) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'qr'>('android');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [networkUrl, setNetworkUrl] = useState<string>('');

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  useEffect(() => {
    // Current URL or network IP
    const current = window.location.href;
    setNetworkUrl(current);

    // QRCode.toDataURL(current, ...)
    setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(current)}`);
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(networkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          isNight
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : isEbook
            ? 'bg-[#fcf8f0] border-[#d8cbbb] text-[#1e1b18]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* 모달 상단 헤더 */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isNight ? 'border-slate-800 bg-slate-950/40' : isEbook ? 'border-[#e6dac5] bg-[#f4ebdc]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl tracking-tight">스마트폰 앱(PWA) 설치 가이드</h3>
              <p className={`text-xs ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                스마트폰 홈 화면에 설치하여 앱스토어 없이 1초 실행
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isNight ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션: 안드로이드 / 아이폰 / PC->폰 QR연결 */}
        <div
          className={`flex border-b text-sm font-bold ${
            isNight ? 'border-slate-800 bg-slate-900' : isEbook ? 'border-[#e6dac5] bg-[#f9f3e6]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activePlatform === 'android'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            🤖 갤럭시 / 안드로이드
          </button>
          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activePlatform === 'ios'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            🍎 아이폰 (Safari)
          </button>
          <button
            onClick={() => setActivePlatform('qr')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activePlatform === 'qr'
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            📱 QR로 폰에서 열기
          </button>
        </div>

        {/* 본문 컨텐츠 */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isStandalone ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
              <div className="font-extrabold text-base">이미 앱으로 실행 중입니다!</div>
              <p className="text-xs opacity-90">
                현재 주소창 없는 단독 앱 모드로 동작 중이며 오프라인 캐싱이 활성화되어 있습니다.
              </p>
            </div>
          ) : null}

          {/* 1. 안드로이드 / 크롬 탭 */}
          {activePlatform === 'android' && (
            <div className="space-y-4">
              {deferredPrompt && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg space-y-3">
                  <div className="flex items-center gap-2 font-black text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>원클릭 즉시 설치 가능</span>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    브라우저에서 설치 준비가 완료되었습니다. 아래 버튼을 누르면 바로 휴대폰 홈 화면에 설치됩니다.
                  </p>
                  <button
                    onClick={() => {
                      onInstallClick();
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-white text-blue-900 font-black text-sm sm:text-base shadow hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5 text-blue-600" />
                    지금 휴대폰 홈 화면에 앱 설치하기
                  </button>
                </div>
              )}

              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isNight ? 'bg-slate-800/60 border-slate-700' : isEbook ? 'bg-[#f4ebd8] border-[#dac9b3]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span>수동 설치 방법 (크롬 / 삼성 인터넷)</span>
                </div>
                <ol className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed list-decimal list-inside">
                  <li>스마트폰 브라우저 우측 상단 <strong>더보기 버튼 [⋮]</strong> 터치</li>
                  <li>메뉴 목록에서 <strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong> 선택</li>
                  <li>팝업 창에서 <strong>[설치]</strong> 터치 시 홈 화면에 아이콘 즉시 생성</li>
                </ol>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-blue-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-blue-100 dark:border-slate-700">
                💡 <strong>앱 설치의 장점</strong>: 브라우저 상하단 주소창이 사라져 시험 공부에 최적화된 큰글씨 전체화면으로 이용할 수 있으며, 데이터가 끊긴 지하철이나 당직실에서도 캐시된 내용으로 즉각 열립니다.
              </div>
            </div>
          )}

          {/* 2. 아이폰 / Safari 탭 */}
          {activePlatform === 'ios' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border space-y-4 ${
                  isNight ? 'bg-slate-800/60 border-slate-700' : isEbook ? 'bg-[#f4ebd8] border-[#dac9b3]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-black text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <span>아이폰(iOS) 사파리 3단계 홈 화면 설치법</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      아이폰 <strong>Safari(사파리)</strong> 브라우저 하단 중앙의 <strong>공유 버튼</strong>(
                      <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> 사각형 위 화살표)을 터치합니다.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      나타나는 공유 시트 메뉴를 아래로 내려 <strong>[홈 화면에 추가]</strong>(
                      <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />)를 터치합니다.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      우측 상단의 <strong>[추가]</strong> 버튼을 누르면 아이폰 홈 화면에 <strong>『형소법2027』</strong> 전용 앱 아이콘이 생성됩니다!
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
                ⚠️ <strong>아이폰 주의사항</strong>: 카카오톡 인앱 브라우저나 네이버 앱 내부 브라우저에서는 홈 화면 추가가 지원되지 않으므로, 반드시 <strong>Safari(사파리)</strong> 브라우저로 열어주세요.
              </div>
            </div>
          )}

          {/* 3. PC에서 스마트폰으로 열기 (QR 코드 & URL) */}
          {activePlatform === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-block shadow-md">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="스마트폰 연결 QR 코드" className="w-48 h-48 mx-auto rounded-lg" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                    QR 코드 로딩 중...
                  </div>
                )}
                <div className="mt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  스마트폰 기본 카메라로 비추세요
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="text-xs font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Wifi className="w-4 h-4" />
                  <span>동일 Wi-Fi / 네트워크 연결 주소</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={networkUrl}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-mono border ${
                      isNight
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : isEbook
                        ? 'bg-[#f4ebd8] border-[#dac9b3] text-slate-900'
                        : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold shadow hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '복사됨!' : '주소 복사'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  PC와 스마트폰이 같은 Wi-Fi나 공유기에 연결되어 있으면, 위 주소를 스마트폰 브라우저에 입력하거나 QR 코드를 찍어 즉시 접속할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        <div
          className={`p-4 border-t text-right ${
            isNight ? 'border-slate-800 bg-slate-950/40' : isEbook ? 'border-[#e6dac5] bg-[#f4ebdc]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 font-bold text-sm transition-colors shadow"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
