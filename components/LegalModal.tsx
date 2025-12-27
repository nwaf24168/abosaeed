
import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-[#070b14]/95 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-white">إتفاقية الاستخدام وسياسة الخصوصية</h2>
            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mt-1">الوثيقة القانونية الرسمية - منصة أبو سعيد</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Legal Content */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-300 text-sm leading-relaxed text-justify">
          <section className="space-y-3">
            <h3 className="text-white font-black border-r-4 border-emerald-500 pr-3 py-1">1. إخلاء المسؤولية القانوني (هام جداً)</h3>
            <p>
              بموجب أنظمة هيئة السوق المالية في المملكة العربية السعودية، تقر أنت المستخدم بأن "منصة أبو سعيد" هي منصة أدوات فنية وتحليلية تعتمد على الذكاء الاصطناعي والمعادلات الرياضية، وهي <strong>ليست</strong> وسيطاً مالياً ولا تقدم "توصيات استثمارية" أو استشارات مالية بالمعنى النظامي. إن كافة البيانات والنتائج الظاهرة هي لأغراض تعليمية وفنية بحتة لمساعدة المتداول في قراءة الشاشة.
            </p>
            <p className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 text-rose-200 font-bold">
              يتحمل المستخدم وحده كامل المسؤولية القانونية والمالية والشرعية المترتبة على قرارات البيع والشراء. ولا تتحمل المنصة أو مالكها أو مطوروها أي مسؤولية عن أي خسائر مالية، مباشرة أو غير مباشرة، ناتجة عن استخدام هذه المنصة أو الاعتماد على بياناتها.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-black border-r-4 border-emerald-500 pr-3 py-1">2. مصادر البيانات والربط الفني</h3>
            <p>
              يتم جلب البيانات عبر بروتوكولات ربط تقنية متقدمة ومزودي بيانات مالية معتمدين عالمياً لضمان الدقة اللحظية. ورغم الجهود المبذولة لضمان جودة التدفق السعري، إلا أن المنصة لا تضمن عدم حدوث انقطاع، تأخير (Latency)، أو أخطاء تقنية ناتجة عن مزودي الخدمة أو ظروف الربط الخارجي أو أعطال شبكة الإنترنت. أي تداول يتم بناءً على هذه البيانات يقع تحت مسؤولية المستخدم الشخصية بالكامل.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-black border-r-4 border-emerald-500 pr-3 py-1">3. سياسة حماية البيانات الشخصية (PDPL)</h3>
            <p>
              التزاماً بنظام حماية البيانات الشخصية السعودي الصادر بالمرسوم الملكي رقم (م/19)، نؤكد أن المنصة تحترم خصوصيتك ولا تقوم بجمع أو تخزين بيانات حساسة (مثل الهوية الوطنية، أرقام الحسابات البنكية، أو المحافظ الاستثمارية). الدخول للمنصة يتم عبر وسيلة حماية موحدة، ولا يتم تتبع نشاط المستخدم الشخصي خارج نطاق تحسين تجربة الاستخدام التقنية.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-black border-r-4 border-emerald-500 pr-3 py-1">4. حقوق الملكية الفكرية والسيبرانية</h3>
            <p>
              كافة الخوارزميات، النماذج التحليلية، التصاميم، وشعار "منصة أبو سعيد" هي ملكية فكرية خاصة ومحمية بموجب أنظمة الهيئة السعودية للملكية الفكرية ونظام مكافحة جرائم المعلوماتية. يمنع منعاً باتاً محاولة استخراج الكود المصدري، أو هندسة الخوارزميات عكسياً، أو إعادة بيع البيانات المستخرجة دون تصريح كتابي مسبق من إدارة المنصة.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-black border-r-4 border-emerald-500 pr-3 py-1">5. الاختصاص القضائي</h3>
            <p>
              تخضع هذه الإتفاقية وتفسر وفقاً لأنظمة وقوانين المملكة العربية السعودية المعمول بها. وفي حال حدوث أي نزاع -لا قدر الله- يتعلق باستخدام المنصة، فإن المحاكم المختصة في المملكة العربية السعودية هي الجهة الوحيدة المخولة بالفصل فيه.
            </p>
          </section>

          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
            <p className="text-xs font-bold text-emerald-400">
              استمرارك في الدخول واستخدام المنصة يعد إقراراً نهائياً بالموافقة على كافة بنود هذه الإتفاقية وإبراءً لذمة المنصة من أي تبعات نظامية.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all active:scale-95"
          >
            إغلاق وقبول البنود القانونية
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
