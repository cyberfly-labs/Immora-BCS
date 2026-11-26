/* Immora BCS 1.0.0 — server edition. Built from web/src by web/build.py. */
const BUILD_MODE = "server"; const APP_VERSION = "1.0.0";
const IMMORA_LOGO = {"icon": "data:image/jpeg;base64,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", "mark": "data:image/jpeg;base64,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"};
const SHARED = {"ROLES": ["admin", "frontdesk", "community", "finance", "viewer"], "COLLECTIONS": ["cfg", "spaces", "plans", "products", "companies", "members", "leads", "tours", "quotes", "contracts", "bookings", "invoices", "creditnotes", "receipts", "charges", "visitors", "checkins", "mail", "calls", "tickets", "access", "outbox", "addressuse"], "WRITE": {"admin": ["access", "addressuse", "bookings", "calls", "cfg", "charges", "checkins", "companies", "contracts", "creditnotes", "invoices", "leads", "mail", "members", "outbox", "plans", "products", "quotes", "receipts", "spaces", "tickets", "tours", "visitors"], "frontdesk": ["access", "bookings", "calls", "charges", "checkins", "mail", "outbox", "tickets", "visitors"], "community": ["addressuse", "bookings", "calls", "charges", "checkins", "companies", "contracts", "leads", "mail", "members", "outbox", "quotes", "tickets", "tours", "visitors"], "finance": ["charges", "companies", "contracts", "creditnotes", "invoices", "outbox", "quotes", "receipts"], "viewer": [], "member": ["bookings", "tickets", "visitors"]}, "ACTIONS": {"billing_run": ["admin", "finance"], "dunning_run": ["admin", "finance"], "notice_reminders": ["admin", "community", "finance"], "renew_contract": ["admin", "community"], "convert_lead": ["admin", "community"], "card_tap": ["admin", "frontdesk"], "payment_link": ["admin", "finance"]}, "SPACE_TYPES": ["hot_desk", "dedicated_desk", "private_office", "meeting_room", "event_space", "virtual_office", "parking", "locker"], "BOOKABLE": ["event_space", "hot_desk", "meeting_room"], "ASSIGNABLE": ["dedicated_desk", "locker", "parking", "private_office", "virtual_office"], "SPACE_STATUS": ["available", "occupied", "reserved", "maintenance"], "LEAD_STAGES": ["new", "contacted", "tour", "proposal", "negotiation", "won", "lost"], "CONTRACT_STATUS": ["draft", "active", "notice", "ended", "renewed", "cancelled"], "INVOICE_STATUS": ["draft", "issued", "part_paid", "paid", "void"], "TICKET_STATUS": ["open", "in_progress", "waiting", "resolved", "closed"], "TICKET_CATS": ["maintenance", "it", "cleaning", "access", "billing", "other"], "PRIORITIES": ["low", "normal", "high", "urgent"], "MAIL_STATUS": ["received", "notified", "collected", "forwarded", "scanned"], "MAIL_TYPES": ["letter", "parcel", "registered", "courier"], "PAY_METHODS": ["bank_transfer", "card", "cash", "cheque", "payment_link"], "DUNNING_DAYS": [1, 14, 30], "NOTICE_WINDOW_DAYS": 14, "PREFIX": {"invoices": "INV", "creditnotes": "CN", "receipts": "RCT", "quotes": "Q", "contracts": "CT", "tickets": "T", "visitors": "V"}, "COUNTRY_PRESETS": {"AE": {"country": "AE", "countryName": "United Arab Emirates", "currency": "AED", "vatRate": 5, "taxLabel": "TRN", "taxIdDigits": 15, "invoiceTitle": "Tax Invoice", "ejari": true, "tz": "Asia/Dubai", "vatName": "VAT"}, "SA": {"country": "SA", "countryName": "Saudi Arabia", "currency": "SAR", "vatRate": 15, "taxLabel": "VAT No.", "taxIdDigits": 15, "invoiceTitle": "Tax Invoice", "ejari": false, "tz": "Asia/Riyadh", "vatName": "VAT"}, "BH": {"country": "BH", "countryName": "Bahrain", "currency": "BHD", "vatRate": 10, "taxLabel": "VAT Account No.", "taxIdDigits": 0, "invoiceTitle": "Tax Invoice", "ejari": false, "tz": "Asia/Bahrain", "vatName": "VAT"}, "OM": {"country": "OM", "countryName": "Oman", "currency": "OMR", "vatRate": 5, "taxLabel": "VATIN", "taxIdDigits": 0, "invoiceTitle": "Tax Invoice", "ejari": false, "tz": "Asia/Muscat", "vatName": "VAT"}, "GB": {"country": "GB", "countryName": "United Kingdom", "currency": "GBP", "vatRate": 20, "taxLabel": "VAT Reg. No.", "taxIdDigits": 0, "invoiceTitle": "VAT Invoice", "ejari": false, "tz": "Europe/London", "vatName": "VAT"}, "IN": {"country": "IN", "countryName": "India", "currency": "INR", "vatRate": 18, "taxLabel": "GSTIN", "taxIdDigits": 0, "invoiceTitle": "Tax Invoice", "ejari": false, "tz": "Asia/Kolkata", "vatName": "GST"}, "INTL": {"country": "INTL", "countryName": "International", "currency": "USD", "vatRate": 0, "taxLabel": "Tax ID", "taxIdDigits": 0, "invoiceTitle": "Invoice", "ejari": false, "tz": "UTC", "vatName": "Tax"}}};
const LOCALE_PACKS = {"ar": {"Accepted": "مقبول", "Access": "الدخول", "Access-card log": "سجل بطاقات الدخول", "Active": "نشط", "Add charge": "إضافة رسوم", "Add company": "إضافة شركة", "Add member": "إضافة عضو", "Add user": "إضافة مستخدم", "Address": "العنوان", "Administration": "الإدارة", "Administrator": "المدير", "Aged receivables": "أعمار الذمم المدينة", "All bookings": "كل الحجوزات", "All clear.": "لا شيء يحتاج إلى متابعة.", "Amount": "المبلغ", "Audit trail": "سجل التدقيق", "Available": "متاح", "Backup & restore": "النسخ الاحتياطي والاستعادة", "Balance": "الرصيد", "Balance due": "الرصيد المستحق", "Bank transfer": "تحويل بنكي", "Bill to": "فاتورة إلى", "Billing": "الفوترة", "Billing run": "تشغيل الفوترة", "Book": "احجز", "Book a room": "احجز قاعة", "Book this room": "احجز هذه القاعة", "Booked": "محجوز", "Bookings": "الحجوزات", "Business Centre System": "نظام مراكز الأعمال", "Business address use": "استخدام العنوان التجاري", "Call answering": "الرد على المكالمات", "Cancel": "إلغاء", "Cancelled": "ملغى", "Card": "بطاقة", "Card tap (simulated)": "تمرير البطاقة (محاكاة)", "Cash": "نقداً", "Category": "الفئة", "Centre settings": "إعدادات المركز", "Change password": "تغيير كلمة المرور", "Charges & add-ons": "الرسوم والإضافات", "Check in": "تسجيل دخول", "Check out": "تسجيل خروج", "Check-in": "تسجيل الدخول", "Checked in": "حاضر", "Checked out": "غادر", "Cheque": "شيك", "Churn": "التسرب", "Cleaning": "تنظيف", "Client": "العميل", "Close": "إغلاق", "Closed": "مغلق", "Collected": "تم الاستلام", "Community manager": "مدير المجتمع", "Companies": "الشركات", "Company": "الشركة", "Confirmed": "مؤكد", "Contacted": "تم التواصل", "Contract": "العقد", "Contracts": "العقود", "Country": "الدولة", "Country preset": "إعداد الدولة المسبق", "Create": "إنشاء", "Credit note": "إشعار دائن", "Credit notes": "الإشعارات الدائنة", "Credits": "الرصيد", "Credits left": "الرصيد المتبقي", "Credits left this month": "الرصيد المتبقي هذا الشهر", "Currency": "العملة", "Dashboard": "لوحة التحكم", "Date": "التاريخ", "Day": "يوم", "Declined": "مرفوض", "Dedicated desk": "مكتب مخصص", "Delete": "حذف", "Demo logins (fictional data)": "حسابات تجريبية (بيانات وهمية)", "Denied": "مرفوض", "Deposit": "التأمين", "Description": "الوصف", "Desk occupancy": "إشغال المكاتب المشتركة", "Done": "تم", "Done editing": "إنهاء التعديل", "Download backup": "تنزيل نسخة احتياطية", "Draft": "مسودة", "Due": "مستحق", "Due date": "تاريخ الاستحقاق", "Edit": "تعديل", "Edit layout": "تعديل المخطط", "Ejari-ready details": "بيانات جاهزة لإيجاري", "Ejari-ready fields": "حقول جاهزة لإيجاري", "Email": "البريد الإلكتروني", "End": "النهاية", "End contract": "إنهاء العقد", "End date": "تاريخ الانتهاء", "Ended": "منتهٍ", "Event space": "مساحة فعاليات", "Expected": "متوقع", "Expired": "منتهي الصلاحية", "Export CSV": "تصدير CSV", "Export to Immora Books": "تصدير إلى Immora Books", "Filter": "تصفية", "Filter this list…": "تصفية هذه القائمة…", "Finance": "المالية", "Floor": "الطابق", "Floor plan": "مخطط الطابق", "Floor plan and live availability": "مخطط الطابق والتوفر المباشر", "Forwarded": "مُعاد توجيهه", "Front desk": "الاستقبال", "Front desk, visitors and mail": "الاستقبال والزوار والبريد", "Full name": "الاسم الكامل", "Go": "انتقال", "Good day": "يوم سعيد", "Granted": "مسموح", "Help": "مساعدة", "Help & requests": "المساعدة والطلبات", "Helpdesk": "الدعم", "High": "عالية", "Home": "الرئيسية", "Host": "المضيف", "Hot desk": "مكتب مشترك", "In progress": "قيد التنفيذ", "In the building": "داخل المبنى", "Invite a guest": "دعوة ضيف", "Invoice": "فاتورة", "Invoice date": "تاريخ الفاتورة", "Invoice no.": "رقم الفاتورة", "Invoices": "الفواتير", "Issue": "إصدار", "Issue all drafts": "إصدار كل المسودات", "Issue credit note": "إصدار إشعار دائن", "Issue tax invoice": "إصدار فاتورة ضريبية", "Issued": "صادرة", "Keyboard shortcuts": "اختصارات لوحة المفاتيح", "Language": "اللغة", "Last 6 months": "آخر 6 أشهر", "Lead pipeline": "مسار العملاء المحتملين", "Legal name": "الاسم القانوني", "Letter": "رسالة", "Light / dark": "فاتح / داكن", "Locker": "خزانة", "Log a call": "تسجيل مكالمة", "Log mail": "تسجيل بريد", "Lost": "خاسر", "Low": "منخفضة", "Mail for me": "بريدي", "Mail log": "سجل البريد", "Mail to hand out": "بريد للتسليم", "Mail waiting": "بريد بانتظارك", "Main menu": "القائمة الرئيسية", "Maintenance": "صيانة", "Meeting room": "قاعة اجتماعات", "Meeting rooms with credits": "قاعات اجتماعات بالرصيد", "Member": "عضو", "Member check-in": "تسجيل دخول عضو", "Member portal": "بوابة الأعضاء", "Members": "الأعضاء", "Members & sales": "الأعضاء والمبيعات", "Menu": "القائمة", "Message": "الرسالة", "Method": "الطريقة", "Mobile": "الجوال", "Month": "شهر", "Monthly fee": "الرسوم الشهرية", "Monthly recurring revenue": "الإيراد الشهري المتكرر", "My bookings": "حجوزاتي", "My guests": "ضيوفي", "My invoices": "فواتيري", "My next bookings": "حجوزاتي القادمة", "Name": "الاسم", "Needs attention": "يحتاج إلى متابعة", "Negotiation": "تفاوض", "New": "جديد", "New booking": "حجز جديد", "New contract": "عقد جديد", "New invoice": "فاتورة جديدة", "New lead": "عميل محتمل جديد", "New quote": "عرض سعر جديد", "New space": "مساحة جديدة", "New ticket": "طلب جديد", "Next": "التالي", "No rooms booked today.": "لا توجد حجوزات للقاعات اليوم.", "Normal": "عادية", "Not due": "غير مستحق", "Notes": "ملاحظات", "Nothing here yet.": "لا يوجد شيء بعد.", "Notice": "إشعار", "Notice period (days)": "فترة الإشعار (أيام)", "Notified": "تم الإبلاغ", "Notify": "إبلاغ", "Number": "الرقم", "Occupancy": "الإشغال", "Occupied": "مشغول", "Office occupancy": "إشغال المكاتب", "Open": "مفتوح", "Open calendar": "فتح التقويم", "Open leads": "عملاء محتملون مفتوحون", "Open pipeline": "فتح المسار", "Open tickets": "طلبات مفتوحة", "Other": "أخرى", "Outbox (simulated)": "صندوق الصادر (محاكاة)", "Overdue": "متأخر", "Overdue & reminders": "المتأخرات والتذكيرات", "Paid": "مدفوعة", "Parcel": "طرد", "Parking": "موقف سيارات", "Part paid": "مدفوعة جزئياً", "Password": "كلمة المرور", "Payment link": "رابط الدفع", "Payments": "المدفوعات", "Phone": "الهاتف", "Pipeline": "مسار المبيعات", "Pipeline value": "قيمة المسار", "Plan": "الباقة", "Plans & add-ons": "الباقات والإضافات", "Please confirm": "يرجى التأكيد", "Powered by Immora": "مدعوم من Immora", "Preview": "معاينة", "Previous": "السابق", "Price": "السعر", "Print": "طباعة", "Print / PDF": "طباعة / PDF", "Print badge": "طباعة البطاقة", "Priority": "الأولوية", "Private office": "مكتب خاص", "Proposal": "عرض", "Purpose": "الغرض", "Qty": "الكمية", "Quantity": "الكمية", "Queued": "في الانتظار", "Quote": "عرض سعر", "Quotes": "عروض الأسعار", "Raise a request": "تقديم طلب", "Reason": "السبب", "Receipt": "إيصال", "Receipts": "الإيصالات", "Received": "مستلم", "Record payment": "تسجيل دفعة", "Recurring billing and tax invoices": "فوترة دورية وفواتير ضريبية", "Reference": "المرجع", "Register visitor": "تسجيل زائر", "Remove": "إزالة", "Renew": "تجديد", "Renew contract": "تجديد العقد", "Renewals & notices": "التجديدات والإشعارات", "Renewals due": "تجديدات مستحقة", "Renewed": "مجدد", "Reports": "التقارير", "Required": "مطلوب", "Reserved": "محجوز", "Reset demo data": "إعادة ضبط البيانات التجريبية", "Resolved": "تم الحل", "Restore": "استعادة", "Revenue": "الإيرادات", "Revenue (6 months, before VAT)": "الإيرادات (6 أشهر، قبل الضريبة)", "Role": "الدور", "Room": "القاعة", "Room bookings today": "حجوزات القاعات اليوم", "Room calendar": "تقويم القاعات", "Room credits left": "رصيد القاعات المتبقي", "Room use": "استخدام القاعات", "Run billing": "تشغيل الفوترة", "Run billing for this month": "تشغيل فوترة هذا الشهر", "Save": "حفظ", "Save draft": "حفظ كمسودة", "Save settings": "حفظ الإعدادات", "Saved": "تم الحفظ", "Search or jump to…": "ابحث أو انتقل إلى…", "Seats": "المقاعد", "Security deposit": "مبلغ التأمين", "Send reminders": "إرسال التذكيرات", "Sent (simulated)": "أُرسل (محاكاة)", "Server edition": "نسخة الخادم", "Settings": "الإعدادات", "Settings saved": "تم حفظ الإعدادات", "Sign in": "تسجيل الدخول", "Sign out": "تسجيل الخروج", "Skip": "تخطي", "Source": "المصدر", "Space status now": "حالة المساحات الآن", "Spaces": "المساحات", "Spaces & prices": "المساحات والأسعار", "Staff sign in": "دخول الموظفين", "Stage": "المرحلة", "Start": "البداية", "Start date": "تاريخ البدء", "Status": "الحالة", "Subject": "الموضوع", "Subtotal": "المجموع الفرعي", "TRN": "الرقم الضريبي", "Take the guided tour": "ابدأ الجولة الإرشادية", "Tap card": "تمرير البطاقة", "Tax Invoice": "فاتورة ضريبية", "Tentative": "مبدئي", "Ticket": "طلب", "Tickets": "الطلبات", "Time": "الوقت", "To pay": "للدفع", "Today": "اليوم", "Today's rooms": "قاعات اليوم", "Total": "الإجمالي", "Total amount due": "إجمالي المبلغ المستحق", "Tour": "جولة", "Tours": "الجولات", "Trade licence": "الرخصة التجارية", "Type": "النوع", "Unit price": "سعر الوحدة", "Upcoming bookings": "الحجوزات القادمة", "Upcoming tours": "الجولات القادمة", "Urgent": "عاجلة", "Use DD-MM-YYYY": "استخدم DD-MM-YYYY", "User": "المستخدم", "Username": "اسم المستخدم", "Users & logins": "المستخدمون وتسجيل الدخول", "View": "عرض", "Viewer": "مشاهد", "Virtual office": "المكتب الافتراضي", "Visitor": "زائر", "Visitor badge": "بطاقة الزائر", "Visitors": "الزوار", "Visitors today": "زوار اليوم", "Void": "ملغاة", "Void invoice": "إلغاء الفاتورة", "Waiting": "بانتظار", "Week": "أسبوع", "Welcome": "مرحباً", "Welcome to your member portal": "مرحباً بك في بوابة الأعضاء", "Won": "ناجح", "Wrong username or password": "اسم المستخدم أو كلمة المرور غير صحيحة", "active contracts, before VAT": "عقود نشطة، قبل الضريبة", "at reception": "في الاستقبال", "dedicated desks": "مكاتب مخصصة", "ends": "ينتهي", "hours booked": "ساعات محجوزة", "in the building": "داخل المبنى", "in use": "قيد الاستخدام", "invoices": "فواتير", "notice by": "الإشعار قبل", "offices": "مكاتب", "this month": "هذا الشهر"}, "fr": {"Accepted": "Accepté", "Access": "Accès", "Access-card log": "Journal des badges", "Active": "Actif", "Add charge": "Ajouter des frais", "Add company": "Ajouter une société", "Add member": "Ajouter un membre", "Add user": "Ajouter un utilisateur", "Address": "Adresse", "Administration": "Administration", "Administrator": "Administrateur", "Aged receivables": "Balance âgée", "All bookings": "Toutes les réservations", "All clear.": "Rien à signaler.", "Amount": "Montant", "Audit trail": "Journal d'audit", "Available": "Disponible", "Backup & restore": "Sauvegarde et restauration", "Balance": "Solde", "Balance due": "Solde dû", "Bank transfer": "Virement", "Bill to": "Facturer à", "Billing": "Facturation", "Billing run": "Facturation périodique", "Book": "Réserver", "Book a room": "Réserver une salle", "Book this room": "Réserver cette salle", "Booked": "Réservé", "Bookings": "Réservations", "Business Centre System": "Système de centre d'affaires", "Business address use": "Domiciliation", "Call answering": "Réponse téléphonique", "Cancel": "Annuler", "Cancelled": "Annulé", "Card": "Carte", "Card tap (simulated)": "Passage de badge (simulé)", "Cash": "Espèces", "Category": "Catégorie", "Centre settings": "Paramètres du centre", "Change password": "Changer le mot de passe", "Charges & add-ons": "Frais et options", "Check in": "Enregistrer l'arrivée", "Check out": "Enregistrer le départ", "Check-in": "Enregistrement", "Checked in": "Arrivé", "Checked out": "Parti", "Cheque": "Chèque", "Churn": "Attrition", "Cleaning": "Nettoyage", "Client": "Client", "Close": "Fermer", "Closed": "Fermé", "Collected": "Retiré", "Community manager": "Community manager", "Companies": "Sociétés", "Company": "Société", "Confirmed": "Confirmé", "Contacted": "Contacté", "Contract": "Contrat", "Contracts": "Contrats", "Country": "Pays", "Country preset": "Préréglage pays", "Create": "Créer", "Credit note": "Avoir", "Credit notes": "Avoirs", "Credits": "Crédits", "Credits left": "Crédits restants", "Credits left this month": "Crédits restants ce mois-ci", "Currency": "Devise", "Dashboard": "Tableau de bord", "Date": "Date", "Day": "Jour", "Declined": "Refusé", "Dedicated desk": "Poste dédié", "Delete": "Supprimer", "Demo logins (fictional data)": "Comptes de démo (données fictives)", "Denied": "Refusé", "Deposit": "Dépôt de garantie", "Description": "Description", "Desk occupancy": "Occupation des postes", "Done": "Terminé", "Done editing": "Terminer", "Download backup": "Télécharger la sauvegarde", "Draft": "Brouillon", "Due": "Dû", "Due date": "Échéance", "Edit": "Modifier", "Edit layout": "Modifier le plan", "Ejari-ready details": "Données prêtes pour Ejari", "Ejari-ready fields": "Champs prêts pour Ejari", "Email": "E-mail", "End": "Fin", "End contract": "Résilier le contrat", "End date": "Date de fin", "Ended": "Terminé", "Event space": "Espace événementiel", "Expected": "Attendu", "Expired": "Expiré", "Export CSV": "Exporter CSV", "Export to Immora Books": "Exporter vers Immora Books", "Filter": "Filtrer", "Filter this list…": "Filtrer cette liste…", "Finance": "Finance", "Floor": "Étage", "Floor plan": "Plan d'étage", "Floor plan and live availability": "Plan d'étage et disponibilité en direct", "Forwarded": "Réexpédié", "Front desk": "Accueil réception", "Front desk, visitors and mail": "Réception, visiteurs et courrier", "Full name": "Nom complet", "Go": "Aller", "Good day": "Bonjour", "Granted": "Autorisé", "Help": "Aide", "Help & requests": "Aide et demandes", "Helpdesk": "Assistance", "High": "Haute", "Home": "Accueil", "Host": "Hôte", "Hot desk": "Poste flexible", "In progress": "En cours", "In the building": "Dans le bâtiment", "Invite a guest": "Inviter un invité", "Invoice": "Facture", "Invoice date": "Date de facture", "Invoice no.": "N° de facture", "Invoices": "Factures", "Issue": "Émettre", "Issue all drafts": "Émettre tous les brouillons", "Issue credit note": "Émettre un avoir", "Issue tax invoice": "Émettre la facture", "Issued": "Émise", "Keyboard shortcuts": "Raccourcis clavier", "Language": "Langue", "Last 6 months": "6 derniers mois", "Lead pipeline": "Pipeline de prospects", "Legal name": "Raison sociale", "Letter": "Lettre", "Light / dark": "Clair / sombre", "Locker": "Casier", "Log a call": "Noter un appel", "Log mail": "Enregistrer un courrier", "Lost": "Perdu", "Low": "Basse", "Mail for me": "Mon courrier", "Mail log": "Registre du courrier", "Mail to hand out": "Courrier à remettre", "Mail waiting": "Courrier en attente", "Main menu": "Menu principal", "Maintenance": "Maintenance", "Meeting room": "Salle de réunion", "Meeting rooms with credits": "Salles de réunion avec crédits", "Member": "Membre", "Member check-in": "Arrivée d'un membre", "Member portal": "Portail membre", "Members": "Membres", "Members & sales": "Membres et ventes", "Menu": "Menu", "Message": "Message", "Method": "Mode", "Mobile": "Portable", "Month": "Mois", "Monthly fee": "Loyer mensuel", "Monthly recurring revenue": "Revenu mensuel récurrent", "My bookings": "Mes réservations", "My guests": "Mes invités", "My invoices": "Mes factures", "My next bookings": "Mes prochaines réservations", "Name": "Nom", "Needs attention": "À traiter", "Negotiation": "Négociation", "New": "Nouveau", "New booking": "Nouvelle réservation", "New contract": "Nouveau contrat", "New invoice": "Nouvelle facture", "New lead": "Nouveau prospect", "New quote": "Nouveau devis", "New space": "Nouvel espace", "New ticket": "Nouveau ticket", "Next": "Suivant", "No rooms booked today.": "Aucune salle réservée aujourd'hui.", "Normal": "Normale", "Not due": "Non échu", "Notes": "Notes", "Nothing here yet.": "Rien pour l'instant.", "Notice": "Préavis", "Notice period (days)": "Préavis (jours)", "Notified": "Notifié", "Notify": "Notifier", "Number": "Numéro", "Occupancy": "Occupation", "Occupied": "Occupé", "Office occupancy": "Occupation des bureaux", "Open": "Ouvert", "Open calendar": "Ouvrir le calendrier", "Open leads": "Prospects ouverts", "Open pipeline": "Ouvrir le pipeline", "Open tickets": "Tickets ouverts", "Other": "Autre", "Outbox (simulated)": "Boîte d'envoi (simulée)", "Overdue": "En retard", "Overdue & reminders": "Impayés et relances", "Paid": "Payée", "Parcel": "Colis", "Parking": "Parking", "Part paid": "Partiellement payée", "Password": "Mot de passe", "Payment link": "Lien de paiement", "Payments": "Paiements", "Phone": "Téléphone", "Pipeline": "Pipeline", "Pipeline value": "Valeur du pipeline", "Plan": "Formule", "Plans & add-ons": "Formules et options", "Please confirm": "Veuillez confirmer", "Powered by Immora": "Propulsé par Immora", "Preview": "Aperçu", "Previous": "Précédent", "Price": "Prix", "Print": "Imprimer", "Print / PDF": "Imprimer / PDF", "Print badge": "Imprimer le badge", "Priority": "Priorité", "Private office": "Bureau privé", "Proposal": "Proposition", "Purpose": "Objet", "Qty": "Qté", "Quantity": "Quantité", "Queued": "En file", "Quote": "Devis", "Quotes": "Devis", "Raise a request": "Faire une demande", "Reason": "Motif", "Receipt": "Reçu", "Receipts": "Reçus", "Received": "Reçu", "Record payment": "Enregistrer un paiement", "Recurring billing and tax invoices": "Facturation récurrente et factures fiscales", "Reference": "Référence", "Register visitor": "Enregistrer un visiteur", "Remove": "Retirer", "Renew": "Renouveler", "Renew contract": "Renouveler le contrat", "Renewals & notices": "Renouvellements et préavis", "Renewals due": "Renouvellements à venir", "Renewed": "Renouvelé", "Reports": "Rapports", "Required": "Obligatoire", "Reserved": "Réservé", "Reset demo data": "Réinitialiser la démo", "Resolved": "Résolu", "Restore": "Restaurer", "Revenue": "Chiffre d'affaires", "Revenue (6 months, before VAT)": "Chiffre d'affaires (6 mois, HT)", "Role": "Rôle", "Room": "Salle", "Room bookings today": "Réservations de salles aujourd'hui", "Room calendar": "Calendrier des salles", "Room credits left": "Crédits salles restants", "Room use": "Utilisation des salles", "Run billing": "Lancer la facturation", "Run billing for this month": "Facturer ce mois", "Save": "Enregistrer", "Save draft": "Enregistrer le brouillon", "Save settings": "Enregistrer les paramètres", "Saved": "Enregistré", "Search or jump to…": "Rechercher ou aller à…", "Seats": "Places", "Security deposit": "Dépôt de garantie", "Send reminders": "Envoyer les relances", "Sent (simulated)": "Envoyé (simulé)", "Server edition": "Édition serveur", "Settings": "Paramètres", "Settings saved": "Paramètres enregistrés", "Sign in": "Se connecter", "Sign out": "Se déconnecter", "Skip": "Passer", "Source": "Source", "Space status now": "État des espaces", "Spaces": "Espaces", "Spaces & prices": "Espaces et tarifs", "Staff sign in": "Connexion équipe", "Stage": "Étape", "Start": "Début", "Start date": "Date de début", "Status": "Statut", "Subject": "Objet", "Subtotal": "Sous-total", "TRN": "TRN", "Take the guided tour": "Visite guidée", "Tap card": "Passer le badge", "Tax Invoice": "Facture fiscale", "Tentative": "Provisoire", "Ticket": "Ticket", "Tickets": "Tickets", "Time": "Heure", "To pay": "À payer", "Today": "Aujourd'hui", "Today's rooms": "Salles du jour", "Total": "Total", "Total amount due": "Total à payer", "Tour": "Visite", "Tours": "Visites", "Trade licence": "Licence commerciale", "Type": "Type", "Unit price": "Prix unitaire", "Upcoming bookings": "Réservations à venir", "Upcoming tours": "Visites à venir", "Urgent": "Urgente", "Use DD-MM-YYYY": "Utilisez JJ-MM-AAAA", "User": "Utilisateur", "Username": "Identifiant", "Users & logins": "Utilisateurs et accès", "View": "Voir", "Viewer": "Lecteur", "Virtual office": "Bureau virtuel", "Visitor": "Visiteur", "Visitor badge": "Badge visiteur", "Visitors": "Visiteurs", "Visitors today": "Visiteurs du jour", "Void": "Annulée", "Void invoice": "Annuler la facture", "Waiting": "En attente", "Week": "Semaine", "Welcome": "Bienvenue", "Welcome to your member portal": "Bienvenue sur votre portail membre", "Won": "Gagné", "Wrong username or password": "Identifiant ou mot de passe incorrect", "active contracts, before VAT": "contrats actifs, HT", "at reception": "à l'accueil", "dedicated desks": "postes dédiés", "ends": "se termine", "hours booked": "heures réservées", "in the building": "dans le bâtiment", "in use": "utilisés", "invoices": "factures", "notice by": "préavis avant", "offices": "bureaux", "this month": "ce mois-ci"}, "hi": {"Accepted": "स्वीकृत", "Access": "एक्सेस", "Access-card log": "एक्सेस कार्ड लॉग", "Active": "सक्रिय", "Add charge": "शुल्क जोड़ें", "Add company": "कंपनी जोड़ें", "Add member": "सदस्य जोड़ें", "Add user": "उपयोगकर्ता जोड़ें", "Address": "पता", "Administration": "प्रशासन", "Administrator": "प्रशासक", "Aged receivables": "पुराने प्राप्य", "All bookings": "सभी बुकिंग", "All clear.": "सब ठीक है।", "Amount": "राशि", "Audit trail": "ऑडिट ट्रेल", "Available": "उपलब्ध", "Backup & restore": "बैकअप और रीस्टोर", "Balance": "शेष", "Balance due": "देय शेष", "Bank transfer": "बैंक ट्रांसफ़र", "Bill to": "बिल प्राप्तकर्ता", "Billing": "बिलिंग", "Billing run": "बिलिंग रन", "Book": "बुक करें", "Book a room": "रूम बुक करें", "Book this room": "यह रूम बुक करें", "Booked": "बुक", "Bookings": "बुकिंग", "Business Centre System": "बिज़नेस सेंटर सिस्टम", "Business address use": "व्यावसायिक पते का उपयोग", "Call answering": "कॉल आंसरिंग", "Cancel": "रद्द करें", "Cancelled": "रद्द", "Card": "कार्ड", "Card tap (simulated)": "कार्ड टैप (सिम्युलेटेड)", "Cash": "नकद", "Category": "श्रेणी", "Centre settings": "सेंटर सेटिंग्स", "Change password": "पासवर्ड बदलें", "Charges & add-ons": "शुल्क और ऐड-ऑन", "Check in": "चेक इन", "Check out": "चेक आउट", "Check-in": "चेक-इन", "Checked in": "चेक इन हुआ", "Checked out": "चेक आउट हुआ", "Cheque": "चेक", "Churn": "चर्न", "Cleaning": "सफ़ाई", "Client": "ग्राहक", "Close": "बंद करें", "Closed": "बंद", "Collected": "लिया गया", "Community manager": "कम्युनिटी मैनेजर", "Companies": "कंपनियाँ", "Company": "कंपनी", "Confirmed": "पुष्ट", "Contacted": "संपर्क किया", "Contract": "अनुबंध", "Contracts": "अनुबंध", "Country": "देश", "Country preset": "देश प्रीसेट", "Create": "बनाएँ", "Credit note": "क्रेडिट नोट", "Credit notes": "क्रेडिट नोट", "Credits": "क्रेडिट", "Credits left": "शेष क्रेडिट", "Credits left this month": "इस महीने शेष क्रेडिट", "Currency": "मुद्रा", "Dashboard": "डैशबोर्ड", "Date": "तारीख", "Day": "दिन", "Declined": "अस्वीकृत", "Dedicated desk": "डेडिकेटेड डेस्क", "Delete": "हटाएँ", "Demo logins (fictional data)": "डेमो लॉगिन (काल्पनिक डेटा)", "Denied": "अस्वीकृत", "Deposit": "जमा राशि", "Description": "विवरण", "Desk occupancy": "डेस्क ऑक्यूपेंसी", "Done": "हो गया", "Done editing": "संपादन पूरा", "Download backup": "बैकअप डाउनलोड करें", "Draft": "ड्राफ्ट", "Due": "देय", "Due date": "देय तिथि", "Edit": "संपादित करें", "Edit layout": "लेआउट संपादित करें", "Ejari-ready details": "Ejari-तैयार विवरण", "Ejari-ready fields": "Ejari-तैयार फ़ील्ड", "Email": "ईमेल", "End": "समाप्त", "End contract": "अनुबंध समाप्त करें", "End date": "समाप्ति तिथि", "Ended": "समाप्त", "Event space": "इवेंट स्पेस", "Expected": "अपेक्षित", "Expired": "समाप्त", "Export CSV": "CSV निर्यात", "Export to Immora Books": "Immora Books में निर्यात", "Filter": "फ़िल्टर", "Filter this list…": "इस सूची को फ़िल्टर करें…", "Finance": "वित्त", "Floor": "मंज़िल", "Floor plan": "फ़्लोर प्लान", "Floor plan and live availability": "फ़्लोर प्लान और लाइव उपलब्धता", "Forwarded": "अग्रेषित", "Front desk": "फ्रंट डेस्क", "Front desk, visitors and mail": "फ्रंट डेस्क, आगंतुक और डाक", "Full name": "पूरा नाम", "Go": "जाएँ", "Good day": "नमस्कार", "Granted": "अनुमति", "Help": "सहायता", "Help & requests": "सहायता और अनुरोध", "Helpdesk": "हेल्पडेस्क", "High": "उच्च", "Home": "होम", "Host": "मेज़बान", "Hot desk": "हॉट डेस्क", "In progress": "प्रगति में", "In the building": "भवन में", "Invite a guest": "मेहमान को आमंत्रित करें", "Invoice": "इनवॉइस", "Invoice date": "इनवॉइस तिथि", "Invoice no.": "इनवॉइस नं.", "Invoices": "इनवॉइस", "Issue": "जारी करें", "Issue all drafts": "सभी ड्राफ्ट जारी करें", "Issue credit note": "क्रेडिट नोट जारी करें", "Issue tax invoice": "टैक्स इनवॉइस जारी करें", "Issued": "जारी", "Keyboard shortcuts": "कीबोर्ड शॉर्टकट", "Language": "भाषा", "Last 6 months": "पिछले 6 महीने", "Lead pipeline": "लीड पाइपलाइन", "Legal name": "कानूनी नाम", "Letter": "पत्र", "Light / dark": "लाइट / डार्क", "Locker": "लॉकर", "Log a call": "कॉल दर्ज करें", "Log mail": "डाक दर्ज करें", "Lost": "हारा", "Low": "कम", "Mail for me": "मेरी डाक", "Mail log": "डाक लॉग", "Mail to hand out": "सौंपने के लिए डाक", "Mail waiting": "प्रतीक्षारत डाक", "Main menu": "मुख्य मेनू", "Maintenance": "रखरखाव", "Meeting room": "मीटिंग रूम", "Meeting rooms with credits": "क्रेडिट के साथ मीटिंग रूम", "Member": "सदस्य", "Member check-in": "सदस्य चेक-इन", "Member portal": "सदस्य पोर्टल", "Members": "सदस्य", "Members & sales": "सदस्य और बिक्री", "Menu": "मेनू", "Message": "संदेश", "Method": "तरीका", "Mobile": "मोबाइल", "Month": "महीना", "Monthly fee": "मासिक शुल्क", "Monthly recurring revenue": "मासिक आवर्ती राजस्व", "My bookings": "मेरी बुकिंग", "My guests": "मेरे मेहमान", "My invoices": "मेरे इनवॉइस", "My next bookings": "मेरी अगली बुकिंग", "Name": "नाम", "Needs attention": "ध्यान दें", "Negotiation": "बातचीत", "New": "नया", "New booking": "नई बुकिंग", "New contract": "नया अनुबंध", "New invoice": "नया इनवॉइस", "New lead": "नई लीड", "New quote": "नया कोटेशन", "New space": "नया स्पेस", "New ticket": "नया टिकट", "Next": "अगला", "No rooms booked today.": "आज कोई रूम बुक नहीं है।", "Normal": "सामान्य", "Not due": "देय नहीं", "Notes": "नोट्स", "Nothing here yet.": "अभी यहाँ कुछ नहीं है।", "Notice": "नोटिस", "Notice period (days)": "नोटिस अवधि (दिन)", "Notified": "सूचित", "Notify": "सूचित करें", "Number": "संख्या", "Occupancy": "ऑक्यूपेंसी", "Occupied": "भरा हुआ", "Office occupancy": "ऑफिस ऑक्यूपेंसी", "Open": "खुला", "Open calendar": "कैलेंडर खोलें", "Open leads": "खुली लीड", "Open pipeline": "पाइपलाइन खोलें", "Open tickets": "खुले टिकट", "Other": "अन्य", "Outbox (simulated)": "आउटबॉक्स (सिम्युलेटेड)", "Overdue": "बकाया", "Overdue & reminders": "बकाया और रिमाइंडर", "Paid": "भुगतान किया", "Parcel": "पार्सल", "Parking": "पार्किंग", "Part paid": "आंशिक भुगतान", "Password": "पासवर्ड", "Payment link": "भुगतान लिंक", "Payments": "भुगतान", "Phone": "फ़ोन", "Pipeline": "पाइपलाइन", "Pipeline value": "पाइपलाइन मूल्य", "Plan": "प्लान", "Plans & add-ons": "प्लान और ऐड-ऑन", "Please confirm": "कृपया पुष्टि करें", "Powered by Immora": "Immora द्वारा संचालित", "Preview": "पूर्वावलोकन", "Previous": "पिछला", "Price": "कीमत", "Print": "प्रिंट", "Print / PDF": "प्रिंट / PDF", "Print badge": "बैज प्रिंट करें", "Priority": "प्राथमिकता", "Private office": "प्राइवेट ऑफिस", "Proposal": "प्रस्ताव", "Purpose": "उद्देश्य", "Qty": "मात्रा", "Quantity": "मात्रा", "Queued": "कतार में", "Quote": "कोटेशन", "Quotes": "कोटेशन", "Raise a request": "अनुरोध दर्ज करें", "Reason": "कारण", "Receipt": "रसीद", "Receipts": "रसीदें", "Received": "प्राप्त", "Record payment": "भुगतान दर्ज करें", "Recurring billing and tax invoices": "आवर्ती बिलिंग और टैक्स इनवॉइस", "Reference": "संदर्भ", "Register visitor": "आगंतुक दर्ज करें", "Remove": "हटाएँ", "Renew": "नवीनीकरण करें", "Renew contract": "अनुबंध नवीनीकृत करें", "Renewals & notices": "नवीनीकरण और नोटिस", "Renewals due": "देय नवीनीकरण", "Renewed": "नवीनीकृत", "Reports": "रिपोर्ट", "Required": "आवश्यक", "Reserved": "आरक्षित", "Reset demo data": "डेमो डेटा रीसेट करें", "Resolved": "हल हुआ", "Restore": "रीस्टोर", "Revenue": "राजस्व", "Revenue (6 months, before VAT)": "राजस्व (6 महीने, वैट से पहले)", "Role": "भूमिका", "Room": "रूम", "Room bookings today": "आज की रूम बुकिंग", "Room calendar": "रूम कैलेंडर", "Room credits left": "शेष रूम क्रेडिट", "Room use": "रूम उपयोग", "Run billing": "बिलिंग चलाएँ", "Run billing for this month": "इस महीने की बिलिंग चलाएँ", "Save": "सहेजें", "Save draft": "ड्राफ्ट सहेजें", "Save settings": "सेटिंग्स सहेजें", "Saved": "सहेजा गया", "Search or jump to…": "खोजें या जाएँ…", "Seats": "सीटें", "Security deposit": "सुरक्षा जमा", "Send reminders": "रिमाइंडर भेजें", "Sent (simulated)": "भेजा गया (सिम्युलेटेड)", "Server edition": "सर्वर संस्करण", "Settings": "सेटिंग्स", "Settings saved": "सेटिंग्स सहेजी गईं", "Sign in": "साइन इन", "Sign out": "साइन आउट", "Skip": "छोड़ें", "Source": "स्रोत", "Space status now": "अभी स्पेस की स्थिति", "Spaces": "स्पेस", "Spaces & prices": "स्पेस और कीमतें", "Staff sign in": "स्टाफ साइन इन", "Stage": "चरण", "Start": "शुरू", "Start date": "प्रारंभ तिथि", "Status": "स्थिति", "Subject": "विषय", "Subtotal": "उप-योग", "TRN": "TRN", "Take the guided tour": "गाइडेड टूर लें", "Tap card": "कार्ड टैप करें", "Tax Invoice": "टैक्स इनवॉइस", "Tentative": "अस्थायी", "Ticket": "टिकट", "Tickets": "टिकट", "Time": "समय", "To pay": "भुगतान करना है", "Today": "आज", "Today's rooms": "आज के रूम", "Total": "कुल", "Total amount due": "कुल देय राशि", "Tour": "टूर", "Tours": "टूर", "Trade licence": "ट्रेड लाइसेंस", "Type": "प्रकार", "Unit price": "इकाई मूल्य", "Upcoming bookings": "आगामी बुकिंग", "Upcoming tours": "आगामी टूर", "Urgent": "अत्यावश्यक", "Use DD-MM-YYYY": "DD-MM-YYYY का उपयोग करें", "User": "उपयोगकर्ता", "Username": "उपयोगकर्ता नाम", "Users & logins": "उपयोगकर्ता और लॉगिन", "View": "देखें", "Viewer": "दर्शक", "Virtual office": "वर्चुअल ऑफिस", "Visitor": "आगंतुक", "Visitor badge": "आगंतुक बैज", "Visitors": "आगंतुक", "Visitors today": "आज के आगंतुक", "Void": "रद्द", "Void invoice": "इनवॉइस रद्द करें", "Waiting": "प्रतीक्षा में", "Week": "सप्ताह", "Welcome": "स्वागत है", "Welcome to your member portal": "आपके सदस्य पोर्टल में स्वागत है", "Won": "जीता", "Wrong username or password": "गलत उपयोगकर्ता नाम या पासवर्ड", "active contracts, before VAT": "सक्रिय अनुबंध, वैट से पहले", "at reception": "रिसेप्शन पर", "dedicated desks": "डेडिकेटेड डेस्क", "ends": "समाप्त", "hours booked": "घंटे बुक", "in the building": "भवन में", "in use": "उपयोग में", "invoices": "इनवॉइस", "notice by": "नोटिस तक", "offices": "ऑफिस", "this month": "इस महीने"}, "ur": {"Accepted": "منظور", "Access": "رسائی", "Access-card log": "ایکسیس کارڈ لاگ", "Active": "فعال", "Add charge": "چارج شامل کریں", "Add company": "کمپنی شامل کریں", "Add member": "ممبر شامل کریں", "Add user": "صارف شامل کریں", "Address": "پتہ", "Administration": "انتظامیہ", "Administrator": "منتظم", "Aged receivables": "پرانی وصولیاں", "All bookings": "تمام بکنگ", "All clear.": "سب ٹھیک ہے۔", "Amount": "رقم", "Audit trail": "آڈٹ ٹریل", "Available": "دستیاب", "Backup & restore": "بیک اپ اور ریسٹور", "Balance": "بقایا", "Balance due": "واجب الادا بقایا", "Bank transfer": "بینک ٹرانسفر", "Bill to": "بل بنام", "Billing": "بلنگ", "Billing run": "بلنگ رن", "Book": "بک کریں", "Book a room": "کمرہ بک کریں", "Book this room": "یہ کمرہ بک کریں", "Booked": "بک شدہ", "Bookings": "بکنگ", "Business Centre System": "بزنس سینٹر سسٹم", "Business address use": "کاروباری پتے کا استعمال", "Call answering": "کال آنسرنگ", "Cancel": "منسوخ کریں", "Cancelled": "منسوخ", "Card": "کارڈ", "Card tap (simulated)": "کارڈ ٹیپ (فرضی)", "Cash": "نقد", "Category": "زمرہ", "Centre settings": "سینٹر سیٹنگز", "Change password": "پاس ورڈ تبدیل کریں", "Charges & add-ons": "چارجز اور ایڈ آن", "Check in": "چیک ان", "Check out": "چیک آؤٹ", "Check-in": "چیک ان", "Checked in": "چیک ان ہو گیا", "Checked out": "چیک آؤٹ ہو گیا", "Cheque": "چیک", "Churn": "چرن", "Cleaning": "صفائی", "Client": "کلائنٹ", "Close": "بند کریں", "Closed": "بند", "Collected": "وصول کر لیا", "Community manager": "کمیونٹی مینیجر", "Companies": "کمپنیاں", "Company": "کمپنی", "Confirmed": "تصدیق شدہ", "Contacted": "رابطہ ہوا", "Contract": "معاہدہ", "Contracts": "معاہدے", "Country": "ملک", "Country preset": "ملک کا پری سیٹ", "Create": "بنائیں", "Credit note": "کریڈٹ نوٹ", "Credit notes": "کریڈٹ نوٹس", "Credits": "کریڈٹس", "Credits left": "باقی کریڈٹس", "Credits left this month": "اس مہینے باقی کریڈٹس", "Currency": "کرنسی", "Dashboard": "ڈیش بورڈ", "Date": "تاریخ", "Day": "دن", "Declined": "مسترد", "Dedicated desk": "مخصوص ڈیسک", "Delete": "حذف کریں", "Demo logins (fictional data)": "ڈیمو لاگ ان (فرضی ڈیٹا)", "Denied": "مسترد", "Deposit": "زر ضمانت", "Description": "تفصیل", "Desk occupancy": "ڈیسک کی گنجائش", "Done": "ہو گیا", "Done editing": "ترمیم مکمل", "Download backup": "بیک اپ ڈاؤن لوڈ کریں", "Draft": "ڈرافٹ", "Due": "واجب", "Due date": "آخری تاریخ", "Edit": "ترمیم کریں", "Edit layout": "لے آؤٹ میں ترمیم", "Ejari-ready details": "ایجاری کے لیے تیار تفصیلات", "Ejari-ready fields": "ایجاری کے لیے تیار خانے", "Email": "ای میل", "End": "اختتام", "End contract": "معاہدہ ختم کریں", "End date": "تاریخ اختتام", "Ended": "ختم", "Event space": "ایونٹ اسپیس", "Expected": "متوقع", "Expired": "میعاد ختم", "Export CSV": "CSV ایکسپورٹ", "Export to Immora Books": "Immora Books میں ایکسپورٹ", "Filter": "فلٹر", "Filter this list…": "اس فہرست کو فلٹر کریں…", "Finance": "مالیات", "Floor": "منزل", "Floor plan": "فلور پلان", "Floor plan and live availability": "فلور پلان اور لائیو دستیابی", "Forwarded": "آگے بھیجا گیا", "Front desk": "فرنٹ ڈیسک", "Front desk, visitors and mail": "فرنٹ ڈیسک، مہمان اور ڈاک", "Full name": "پورا نام", "Go": "جائیں", "Good day": "السلام علیکم", "Granted": "اجازت", "Help": "مدد", "Help & requests": "مدد اور درخواستیں", "Helpdesk": "ہیلپ ڈیسک", "High": "زیادہ", "Home": "ہوم", "Host": "میزبان", "Hot desk": "ہاٹ ڈیسک", "In progress": "جاری", "In the building": "عمارت میں", "Invite a guest": "مہمان کو مدعو کریں", "Invoice": "انوائس", "Invoice date": "انوائس کی تاریخ", "Invoice no.": "انوائس نمبر", "Invoices": "انوائسز", "Issue": "جاری کریں", "Issue all drafts": "تمام ڈرافٹ جاری کریں", "Issue credit note": "کریڈٹ نوٹ جاری کریں", "Issue tax invoice": "ٹیکس انوائس جاری کریں", "Issued": "جاری", "Keyboard shortcuts": "کی بورڈ شارٹ کٹس", "Language": "زبان", "Last 6 months": "پچھلے 6 ماہ", "Lead pipeline": "لیڈ پائپ لائن", "Legal name": "قانونی نام", "Letter": "خط", "Light / dark": "لائٹ / ڈارک", "Locker": "لاکر", "Log a call": "کال درج کریں", "Log mail": "ڈاک درج کریں", "Lost": "ناکام", "Low": "کم", "Mail for me": "میری ڈاک", "Mail log": "ڈاک لاگ", "Mail to hand out": "حوالے کرنے کے لیے ڈاک", "Mail waiting": "منتظر ڈاک", "Main menu": "مین مینو", "Maintenance": "مرمت", "Meeting room": "میٹنگ روم", "Meeting rooms with credits": "کریڈٹس کے ساتھ میٹنگ رومز", "Member": "ممبر", "Member check-in": "ممبر چیک ان", "Member portal": "ممبر پورٹل", "Members": "ممبرز", "Members & sales": "ممبرز اور سیلز", "Menu": "مینو", "Message": "پیغام", "Method": "طریقہ", "Mobile": "موبائل", "Month": "مہینہ", "Monthly fee": "ماہانہ فیس", "Monthly recurring revenue": "ماہانہ بار بار آمدنی", "My bookings": "میری بکنگ", "My guests": "میرے مہمان", "My invoices": "میری انوائسز", "My next bookings": "میری اگلی بکنگ", "Name": "نام", "Needs attention": "توجہ درکار", "Negotiation": "مذاکرات", "New": "نیا", "New booking": "نئی بکنگ", "New contract": "نیا معاہدہ", "New invoice": "نئی انوائس", "New lead": "نئی لیڈ", "New quote": "نیا کوٹیشن", "New space": "نئی جگہ", "New ticket": "نیا ٹکٹ", "Next": "اگلا", "No rooms booked today.": "آج کوئی کمرہ بک نہیں۔", "Normal": "عام", "Not due": "واجب نہیں", "Notes": "نوٹس", "Nothing here yet.": "یہاں ابھی کچھ نہیں۔", "Notice": "نوٹس", "Notice period (days)": "نوٹس کی مدت (دن)", "Notified": "مطلع کیا گیا", "Notify": "مطلع کریں", "Number": "نمبر", "Occupancy": "گنجائش", "Occupied": "زیر استعمال", "Office occupancy": "دفاتر کی گنجائش", "Open": "کھلا", "Open calendar": "کیلنڈر کھولیں", "Open leads": "کھلی لیڈز", "Open pipeline": "پائپ لائن کھولیں", "Open tickets": "کھلے ٹکٹس", "Other": "دیگر", "Outbox (simulated)": "آؤٹ باکس (فرضی)", "Overdue": "واجب الادا", "Overdue & reminders": "واجبات اور یاد دہانیاں", "Paid": "ادا شدہ", "Parcel": "پارسل", "Parking": "پارکنگ", "Part paid": "جزوی ادا شدہ", "Password": "پاس ورڈ", "Payment link": "ادائیگی کا لنک", "Payments": "ادائیگیاں", "Phone": "فون", "Pipeline": "پائپ لائن", "Pipeline value": "پائپ لائن کی قیمت", "Plan": "پلان", "Plans & add-ons": "پلان اور ایڈ آن", "Please confirm": "براہ کرم تصدیق کریں", "Powered by Immora": "Immora کی طرف سے", "Preview": "پیش نظارہ", "Previous": "پچھلا", "Price": "قیمت", "Print": "پرنٹ", "Print / PDF": "پرنٹ / PDF", "Print badge": "بیج پرنٹ کریں", "Priority": "ترجیح", "Private office": "نجی دفتر", "Proposal": "تجویز", "Purpose": "مقصد", "Qty": "مقدار", "Quantity": "مقدار", "Queued": "قطار میں", "Quote": "کوٹیشن", "Quotes": "کوٹیشنز", "Raise a request": "درخواست درج کریں", "Reason": "وجہ", "Receipt": "رسید", "Receipts": "رسیدیں", "Received": "موصول", "Record payment": "ادائیگی درج کریں", "Recurring billing and tax invoices": "بار بار بلنگ اور ٹیکس انوائسز", "Reference": "حوالہ", "Register visitor": "مہمان درج کریں", "Remove": "ہٹائیں", "Renew": "تجدید کریں", "Renew contract": "معاہدے کی تجدید کریں", "Renewals & notices": "تجدید اور نوٹس", "Renewals due": "واجب تجدید", "Renewed": "تجدید شدہ", "Reports": "رپورٹس", "Required": "ضروری", "Reserved": "محفوظ", "Reset demo data": "ڈیمو ڈیٹا ری سیٹ کریں", "Resolved": "حل شدہ", "Restore": "ریسٹور", "Revenue": "آمدنی", "Revenue (6 months, before VAT)": "آمدنی (6 ماہ، VAT سے پہلے)", "Role": "کردار", "Room": "کمرہ", "Room bookings today": "آج کی کمرہ بکنگ", "Room calendar": "کمروں کا کیلنڈر", "Room credits left": "کمروں کے باقی کریڈٹس", "Room use": "کمروں کا استعمال", "Run billing": "بلنگ چلائیں", "Run billing for this month": "اس مہینے کی بلنگ چلائیں", "Save": "محفوظ کریں", "Save draft": "ڈرافٹ محفوظ کریں", "Save settings": "سیٹنگز محفوظ کریں", "Saved": "محفوظ ہو گیا", "Search or jump to…": "تلاش کریں یا جائیں…", "Seats": "نشستیں", "Security deposit": "سیکیورٹی ڈپازٹ", "Send reminders": "یاد دہانیاں بھیجیں", "Sent (simulated)": "بھیجا گیا (فرضی)", "Server edition": "سرور ایڈیشن", "Settings": "سیٹنگز", "Settings saved": "سیٹنگز محفوظ ہو گئیں", "Sign in": "سائن ان", "Sign out": "سائن آؤٹ", "Skip": "چھوڑیں", "Source": "ذریعہ", "Space status now": "جگہوں کی موجودہ حالت", "Spaces": "جگہیں", "Spaces & prices": "جگہیں اور قیمتیں", "Staff sign in": "اسٹاف سائن ان", "Stage": "مرحلہ", "Start": "آغاز", "Start date": "تاریخ آغاز", "Status": "حالت", "Subject": "موضوع", "Subtotal": "ذیلی کل", "TRN": "TRN", "Take the guided tour": "گائیڈڈ ٹور لیں", "Tap card": "کارڈ ٹیپ کریں", "Tax Invoice": "ٹیکس انوائس", "Tentative": "عارضی", "Ticket": "ٹکٹ", "Tickets": "ٹکٹس", "Time": "وقت", "To pay": "ادا کرنا ہے", "Today": "آج", "Today's rooms": "آج کے کمرے", "Total": "کل", "Total amount due": "کل واجب الادا رقم", "Tour": "ٹور", "Tours": "ٹورز", "Trade licence": "تجارتی لائسنس", "Type": "قسم", "Unit price": "فی یونٹ قیمت", "Upcoming bookings": "آنے والی بکنگ", "Upcoming tours": "آنے والے ٹورز", "Urgent": "فوری", "Use DD-MM-YYYY": "DD-MM-YYYY استعمال کریں", "User": "صارف", "Username": "صارف نام", "Users & logins": "صارفین اور لاگ ان", "View": "دیکھیں", "Viewer": "ناظر", "Virtual office": "ورچوئل آفس", "Visitor": "مہمان", "Visitor badge": "مہمان بیج", "Visitors": "مہمان", "Visitors today": "آج کے مہمان", "Void": "کالعدم", "Void invoice": "انوائس منسوخ کریں", "Waiting": "منتظر", "Week": "ہفتہ", "Welcome": "خوش آمدید", "Welcome to your member portal": "آپ کے ممبر پورٹل میں خوش آمدید", "Won": "کامیاب", "Wrong username or password": "غلط صارف نام یا پاس ورڈ", "active contracts, before VAT": "فعال معاہدے، VAT سے پہلے", "at reception": "استقبالیہ پر", "dedicated desks": "مخصوص ڈیسک", "ends": "ختم", "hours booked": "بک شدہ گھنٹے", "in the building": "عمارت میں", "in use": "زیر استعمال", "invoices": "انوائسز", "notice by": "نوٹس بذریعہ", "offices": "دفاتر", "this month": "اس مہینے"}};
const SEED_BASE = null, SEED = null, DEMO_USERS = [];
/* ===== vendor/qrcode.js (MIT, Kazuhiko Arase) ===== */
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));

/* ===== 00-util.js ===== */
/* Small helpers shared by every screen. */
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const h = v => String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
function stableStr(v) {
  if (v === undefined) return "null";
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStr).join(",") + "]";
  return "{" + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ":" + stableStr(v[k])).join(",") + "}";
}
const uid = p => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase().replace(/[^A-Z0-9-]/g, "");
const pad2 = n => String(n).padStart(2, "0");
const fmtD = s => s ? `${String(s).slice(8, 10)}-${String(s).slice(5, 7)}-${String(s).slice(0, 4)}` : "";
const fmtDT = s => s ? `${fmtD(s)} ${String(s).slice(11, 16)}` : "";
function parseD(s) { // DD-MM-YYYY (or D/M/YYYY, or ISO) -> YYYY-MM-DD or null
  s = String(s || "").trim(); if (!s) return "";
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s); if (m) return chkISO(m[1], m[2], m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(s); if (m) return chkISO(m[3], m[2], m[1]);
  return null;
}
function chkISO(y, mo, d) { const iso = `${y}-${pad2(mo)}-${pad2(d)}`; return R.validDate(iso) ? iso : null; }
const CUR = () => (cfg().currency || "AED");
const money = (x, cur) => `${cur === false ? "" : (cur || CUR()) + " "}${Number(x || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money0 = x => `${CUR()} ${Math.round(Number(x || 0)).toLocaleString("en-US")}`;
const pct = x => `${Math.round(Number(x || 0))}%`;
const sum = (a, f) => a.reduce((t, x) => t + Number(f ? f(x) : x) , 0);
const byId = (c, id) => (DB[c] || []).find(r => r.id === id) || null;
const cfg = () => (DB.cfg || []).find(r => r.id === "centre") || {};
const timeOpts = (sel, from = 7, to = 22) => { let o = ""; for (let hh = from; hh <= to; hh++) for (const mm of [0, 30]) { if (hh === to && mm) continue; const v = `${pad2(hh)}:${pad2(mm)}`; o += `<option ${v === sel ? "selected" : ""}>${v}</option>`; } return o; };
function opts(list, sel, blank) { return (blank !== undefined ? `<option value="">${h(blank)}</option>` : "") + list.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${h(v)}" ${String(v) === String(sel === undefined ? "" : sel) ? "selected" : ""}>${h(l)}</option>`; }).join(""); }
function download(name, text, type) { const b = new Blob([text], { type: type || "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function csv(rows, cols) { const q = v => { const s = String(v === null || v === undefined ? "" : v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }; return "\ufeff" + [cols.map(c => q(c[1])).join(",")].concat(rows.map(r => cols.map(c => q(typeof c[0] === "function" ? c[0](r) : r[c[0]])).join(","))).join("\r\n"); }
function toast(msg, kind) {
  let box = $("#toasts"); if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
  const t = document.createElement("div"); t.className = "toast " + (kind || "ok"); t.setAttribute("role", kind === "err" ? "alert" : "status"); t.textContent = msg; box.appendChild(t);
  setTimeout(() => t.classList.add("out"), kind === "err" ? 5200 : 2800); setTimeout(() => t.remove(), kind === "err" ? 5600 : 3200);
}
/* icons: 24px stroke icons, inline SVG */
const ICONS = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z", map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", cal: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5", users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  building: "M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18", funnel: "M3 4h18l-7 8v6l-4 2v-8z", file: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h7M9 17h7",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7", phone: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2", receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4",
  bill: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5", door: "M6 3h12v18H6zM14 12h.01M3 21h18", qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 18h2M18 14h3",
  tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3", plus: "M12 5v14M5 12h14", moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z", sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  menu: "M3 6h18M3 12h18M3 18h18", x: "M18 6L6 18M6 6l12 12", chev: "M6 9l6 6 6-6", check: "M20 6L9 17l-5-5", logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  print: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z", card: "M2 5h20v14H2zM2 10h20", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4", upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01", ticket: "M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4z",
  coffee: "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3", globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7", alert: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  refresh: "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15", send: "M22 2L11 13M22 2l-7 20-4-9-9-4z", edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
};
const ic = (n, cls) => `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ICONS.file}"/></svg>`;

/* ===== 01-i18n.js ===== */
/* Languages: English is built in; packs in web/locales/*.json map English text -> translation.
   Arabic and Urdu switch the whole layout to right-to-left. */
const LANGS = [["en", "English"], ["ar", "العربية"], ["fr", "Français"], ["hi", "हिन्दी"], ["ur", "اردو"]];
const RTL = new Set(["ar", "ur"]);
let LANG = "en";
function t(s, vars) {
  let out = (LANG !== "en" && LOCALE_PACKS[LANG] && LOCALE_PACKS[LANG][s]) || s;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split("{" + k + "}").join(v);
  return out;
}
function setLang(l, persist) {
  LANG = LOCALE_PACKS[l] || l === "en" ? l : "en";
  document.documentElement.lang = LANG; document.documentElement.dir = RTL.has(LANG) ? "rtl" : "ltr";
  try { localStorage.setItem("immora-bcs-lang", LANG); } catch (e) { /* private mode */ }
  if (persist && ME) Backend.setLang(LANG);
}
/* status / type labels go through t() too */
const LABELS = {
  hot_desk: "Hot desk", dedicated_desk: "Dedicated desk", private_office: "Private office", meeting_room: "Meeting room", event_space: "Event space",
  virtual_office: "Virtual office", parking: "Parking", locker: "Locker", available: "Available", occupied: "Occupied", reserved: "Reserved", maintenance: "Maintenance",
  new: "New", contacted: "Contacted", tour: "Tour", proposal: "Proposal", negotiation: "Negotiation", won: "Won", lost: "Lost",
  draft: "Draft", active: "Active", notice: "Notice", ended: "Ended", renewed: "Renewed", cancelled: "Cancelled", issued: "Issued", part_paid: "Part paid",
  paid: "Paid", void: "Void", open: "Open", in_progress: "In progress", waiting: "Waiting", resolved: "Resolved", closed: "Closed", maintenance_c: "Maintenance",
  it: "IT", cleaning: "Cleaning", access: "Access", billing: "Billing", other: "Other", low: "Low", normal: "Normal", high: "High", urgent: "Urgent",
  received: "Received", notified: "Notified", collected: "Collected", forwarded: "Forwarded", scanned: "Scanned", letter: "Letter", parcel: "Parcel",
  registered: "Registered", courier: "Courier", bank_transfer: "Bank transfer", card: "Card", cash: "Cash", cheque: "Cheque", payment_link: "Payment link",
  confirmed: "Confirmed", tentative: "Tentative", checked_in: "Checked in", checked_out: "Checked out", expected: "Expected", booked: "Booked", done: "Done",
  no_show: "No-show", granted: "Granted", denied: "Denied", queued: "Queued", sent_simulated: "Sent (simulated)", passed_on: "Passed on", sent: "Sent",
  accepted: "Accepted", declined: "Declined", expired: "Expired", paused: "Paused", not_due: "Not due", due: "Due", refunded: "Refunded", part_refunded: "Part refunded",
  admin: "Administrator", frontdesk: "Front desk", community: "Community manager", finance: "Finance", viewer: "Viewer", member: "Member",
};
const L = k => t(LABELS[k] || String(k || "").replace(/_/g, " "));

/* ===== 02-rules.js ===== */
/* Business rules for the offline edition: a line-by-line port of immora_bcs/rules.py and actions.py.
   tests/test_parity.py runs both on the same data and compares the results. */
const R = (() => {
  const S = SHARED;
  class RuleError extends Error { constructor(msg, field, status) { super(msg); this.field = field || null; this.status = status || 400; } }
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/, DATE_RE = /^\d{4}-\d{2}-\d{2}$/, DT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  const r2 = x => { x = Number(x || 0); return Math.sign(x) * Math.round(Math.abs(x) * 100 + 1e-7) / 100 + 0; };
  const pad = n => String(n).padStart(2, "0");
  const dObj = s => { const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const isoD = dt => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const addDays = (s, n) => { const x = dObj(s); x.setUTCDate(x.getUTCDate() + n); return isoD(x); };
  const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m 1-12
  const addMonths = (s, n) => { const [y0, m0, d0] = String(s).slice(0, 10).split("-").map(Number); let m = m0 - 1 + n; const y = y0 + Math.floor(m / 12); m = ((m % 12) + 12) % 12 + 1; return `${y}-${pad(m)}-${pad(Math.min(d0, dim(y, m)))}`; };
  const monthBounds = s => { const [y, m] = String(s).slice(0, 10).split("-").map(Number); return [`${y}-${pad(m)}-01`, `${y}-${pad(m)}-${pad(dim(y, m))}`]; };
  const daysBetween = (a, b) => Math.round((dObj(b) - dObj(a)) / 86400000);
  const fmtDate = s => s ? `${String(s).slice(8, 10)}-${String(s).slice(5, 7)}-${String(s).slice(0, 4)}` : "";
  const validDate = v => { if (!DATE_RE.test(String(v))) return false; const x = dObj(v); return isoD(x) === String(v); };
  const hoursBetween = (a, b) => (Date.parse(b + ":00Z") - Date.parse(a + ":00Z")) / 3600000;
  const fmtNum = (f) => (Number.isInteger(f) ? String(f) : String(f));
  const fmtG = f => { const x = Number(f); return Number.isInteger(x) ? String(x) : String(x); };

  function num(v, field, minimum = 0, allowNone = false) {
    if ((v === null || v === undefined || v === "") && allowNone) return null;
    const f = typeof v === "number" ? v : (v === null || v === undefined || String(v).trim() === "" ? NaN : Number(v));
    if (!isFinite(f)) throw new RuleError(`${field}: enter a number`, field);
    if (minimum !== null && f < minimum) throw new RuleError(`${field}: must be ${fmtG(minimum)} or more`, field);
    return f;
  }
  function checkDate(v, field, required = true) {
    if (v === null || v === undefined || v === "") { if (required) throw new RuleError(`${field}: date is required`, field); return null; }
    if (!validDate(v)) throw new RuleError(`${field}: use a valid date (DD-MM-YYYY)`, field);
    return v;
  }
  function checkDt(v, field) {
    if (!v || !DT_RE.test(String(v))) throw new RuleError(`${field}: date and time are required`, field);
    const [dd, tt] = v.split("T"); const [h, m] = tt.split(":").map(Number);
    if (!validDate(dd) || h > 23 || m > 59) throw new RuleError(`${field}: use a valid date and time`, field);
    return v;
  }
  function lineTotals(lines, defRate) {
    const out = []; let sub = 0, vat = 0;
    (lines || []).forEach((ln, i) => {
      const desc = String(ln.desc || "").trim();
      if (!desc) throw new RuleError(`Line ${i + 1}: description is required`, "lines");
      const qty = num(ln.qty === undefined ? 1 : ln.qty, `Line ${i + 1} quantity`, 0);
      const price = num(ln.price === undefined ? 0 : ln.price, `Line ${i + 1} price`, null);
      const rate = num(ln.vat === undefined ? defRate : ln.vat, `Line ${i + 1} VAT %`, 0);
      if (rate > 100) throw new RuleError(`Line ${i + 1}: VAT % must be 100 or less`, "lines");
      const net = r2(qty * price), tax = r2(net * rate / 100);
      out.push(Object.assign({}, ln, { desc, qty, price: r2(price), vat: rate, net, tax })); sub += net; vat += tax;
    });
    sub = r2(sub); vat = r2(vat);
    return [out, sub, vat, r2(sub + vat)];
  }
  function prorate(amount, from, to, ps, pe) {
    const a = from > ps ? from : ps, b = to ? (to < pe ? to : pe) : pe;
    const total = daysBetween(ps, pe) + 1, days = daysBetween(a, b) + 1;
    if (days <= 0) return [0, 0, total];
    if (days >= total) return [r2(amount), total, total];
    return [r2(Number(amount) * days / total), days, total];
  }
  function validTrn(trn, cfg) {
    const t = String(trn || "").replace(/[\s-]/g, ""); if (!t) return true;
    const n = Number((cfg || {}).taxIdDigits || 0);
    if (n) return /^\d+$/.test(t) && t.length === n;
    return t.length >= 3 && t.length <= 20;
  }
  const find = (db, c, id) => (db[c] || []).find(r => r.id === id) || null;
  const cfgOf = db => (db.cfg || []).find(r => r.id === "centre") || Object.assign({}, S.COUNTRY_PRESETS.AE);
  const allowance = (m, plans) => { const p = plans.find(x => x.id === m.planId); return Number((p || {}).credits || 0) + Number(m.extraCredits || 0); };
  function creditsUsed(mid, month, bookings, excl) {
    const [ms, me] = monthBounds(month); let t = 0;
    for (const b of bookings) { if (b.memberId !== mid || b.status === "cancelled" || b.id === excl) continue; const d = String(b.start || "").slice(0, 10); if (d >= ms && d <= me) t += Number(b.creditsUsed || 0); }
    return r2(t);
  }
  const creditsLeft = (m, today, bookings, plans, excl) => r2(allowance(m, plans) - creditsUsed(m.id, today, bookings, excl));
  function priceBooking(b, sp, m, bookings, plans) {
    const hrs = r2(hoursBetween(b.start, b.end)), rate = Number(sp.creditRate || 1), need = r2(hrs * rate);
    if (!m) return [0, hrs, r2(hrs * Number(sp.priceHour || 0))];
    const left = Math.max(0, creditsLeft(m, b.start.slice(0, 10), bookings, plans, b.id));
    const use = Math.min(need, left), shortH = rate ? r2((need - use) / rate) : 0;
    return [r2(use), shortH, r2(shortH * Number(sp.priceHour || 0))];
  }
  const req = (rec, f, label) => { const v = rec[f]; if (v === null || v === undefined || (typeof v === "string" && !v.trim())) throw new RuleError(`${label || f} is required`, f); return v; };
  const en = (rec, f, values, def) => { const v = rec[f] || def; if (!values.includes(v)) throw new RuleError(`${f}: choose one of ${values.join(", ")}`, f); rec[f] = v; return v; };
  const setdef = (rec, k, v) => { if (!(k in rec)) rec[k] = v; };

  function nextNumber(coll, db, today) {
    const p = S.PREFIX[coll], y = String(today).slice(0, 4);
    const simple = coll === "tickets" || coll === "visitors";
    const re = simple ? new RegExp(`^${p}-(\\d+)$`) : new RegExp(`^${p}-${y}-(\\d+)$`);
    let top = 0; for (const r of db[coll] || []) { const m = re.exec(String(r.number || "")); if (m) top = Math.max(top, Number(m[1])); }
    return `${simple ? p + "-" : p + "-" + y + "-"}${String(top + 1).padStart(4, "0")}`;
  }
  function numberIt(rec, old, coll, db, today) {
    if (old && old.number) { rec.number = old.number; return; }
    if (rec.number && !old) { if ((db[coll] || []).some(r => r.number === rec.number)) throw new RuleError(`Number ${rec.number} is already used`, "number"); return; }
    rec.number = nextNumber(coll, db, today);
  }
  function party(rec, db) {
    if (rec.companyId) { const c = find(db, "companies", rec.companyId); if (!c) throw new RuleError("Company not found", "companyId"); return c; }
    if (rec.memberId) { const m = find(db, "members", rec.memberId); if (!m) throw new RuleError("Member not found", "memberId"); return m; }
    return null;
  }
  function partySnapshot(rec, db) {
    const c = rec.companyId ? find(db, "companies", rec.companyId) : null;
    if (c) return { name: c.legalName, address: c.address || "", trn: c.trn || "", email: c.email || "" };
    const m = rec.memberId ? find(db, "members", rec.memberId) : null;
    if (m) return { name: m.name, address: m.address || "", trn: m.trn || "", email: m.email || "" };
    return { name: rec.customerName || "", address: "", trn: "", email: "" };
  }
  const supplierSnapshot = cfg => Object.fromEntries(["legalName", "address", "trn", "licenceNo", "phone", "email", "taxLabel", "invoiceTitle", "currency"].map(k => [k, cfg[k] === undefined ? "" : cfg[k]]));
  const balance = (inv, db) => r2(Number(inv.total || 0) - Number(inv.paid || 0) - (db.creditnotes || []).filter(c => c.invoiceId === inv.id).reduce((a, c) => a + Number(c.total || 0), 0));
  function refresh(inv, db) {
    if (inv.status === "void") return inv;
    const bal = balance(inv, db);
    inv.status = bal <= 0.004 ? "paid" : ((Number(inv.paid || 0) > 0 || inv.credited) ? "part_paid" : "issued");
    return inv;
  }
  const isMember = u => u.role === "member";

  const V = {
    spaces(rec, old, db) {
      req(rec, "code", "Code"); req(rec, "name", "Name"); en(rec, "type", S.SPACE_TYPES); en(rec, "status", S.SPACE_STATUS, "available");
      for (const f of ["priceMonth", "priceHour", "priceDay", "creditRate", "capacity", "area"]) if (rec[f] !== undefined && rec[f] !== null && rec[f] !== "") rec[f] = num(rec[f], f, 0);
      rec.code = rec.code.trim().toUpperCase();
      if ((db.spaces || []).some(s => String(s.code || "").toUpperCase() === rec.code && s.id !== rec.id)) throw new RuleError(`Space code ${rec.code} is already used`, "code");
    },
    plans(rec) { req(rec, "name", "Plan name"); rec.price = num(rec.price === undefined ? 0 : rec.price, "price", 0); rec.credits = num(rec.credits === undefined ? 0 : rec.credits, "credits", 0); },
    products(rec) { req(rec, "name", "Name"); rec.price = num(rec.price === undefined ? 0 : rec.price, "price", 0); },
    companies(rec, old, db, u, today, cfg) {
      req(rec, "legalName", "Legal name");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      if (!validTrn(rec.trn, cfg)) { const n = cfg.taxIdDigits; throw new RuleError(n ? `${cfg.taxLabel || "TRN"}: must be ${n} digits` : "Tax ID looks wrong", "trn"); }
      if (rec.licenceExpiry) checkDate(rec.licenceExpiry, "Licence expiry");
    },
    members(rec, old, db, u, today) {
      req(rec, "name", "Name"); en(rec, "status", ["active", "paused", "ended"], "active");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      if (rec.companyId && !find(db, "companies", rec.companyId)) throw new RuleError("Company not found", "companyId");
      checkDate(rec.start || today, "Start date"); setdef(rec, "start", today);
      if (rec.end) checkDate(rec.end, "End date");
      const card = String(rec.cardNo || "").trim();
      if (card && (db.members || []).some(m => m.cardNo === card && m.id !== rec.id)) throw new RuleError(`Access card ${card} is already given to another member`, "cardNo");
      rec.extraCredits = num(rec.extraCredits || 0, "extraCredits", null);
    },
    leads(rec, old, db, u, today) {
      req(rec, "name", "Name"); en(rec, "stage", S.LEAD_STAGES, "new");
      if (rec.email && !EMAIL_RE.test(rec.email)) throw new RuleError("Email: enter a valid email address", "email");
      rec.budget = num(rec.budget || 0, "budget", 0); setdef(rec, "created", today);
    },
    tours(rec) { checkDt(rec.when, "Tour date and time"); en(rec, "status", ["booked", "done", "no_show", "cancelled"], "booked"); if (!rec.leadId && !rec.name) throw new RuleError("Choose a lead or enter the visitor's name", "leadId"); },
    quotes(rec, old, db, u, today, cfg) {
      if (!rec.leadId && !rec.companyId && !rec.memberId) throw new RuleError("Choose a lead, company or member", "leadId");
      checkDate(rec.date || today, "Quote date"); setdef(rec, "date", today);
      rec.validUntil = checkDate(rec.validUntil || addDays(rec.date, 14), "Valid until");
      en(rec, "status", ["draft", "sent", "accepted", "declined", "expired"], "draft");
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      if (!rec.lines.length) throw new RuleError("Add at least one line", "lines");
      numberIt(rec, old, "quotes", db, today);
    },
    contracts(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose the client (company or member)", "companyId");
      party(rec, db); checkDate(rec.start, "Start date"); checkDate(rec.end, "End date");
      if (rec.end < rec.start) throw new RuleError("End date must be after the start date", "end");
      en(rec, "status", S.CONTRACT_STATUS, "draft");
      rec.monthlyFee = num(rec.monthlyFee === undefined ? 0 : rec.monthlyFee, "Monthly fee", 0);
      rec.deposit = num(rec.deposit || 0, "Deposit", 0);
      rec.noticeDays = Math.trunc(num(rec.noticeDays === undefined ? 60 : (rec.noticeDays || 0), "Notice period", 0));
      en(rec, "depositStatus", ["not_due", "due", "received", "refunded", "part_refunded"], rec.deposit ? "due" : "not_due");
      rec.spaceIds = (rec.spaceIds || []).filter(Boolean);
      for (const sid of rec.spaceIds) {
        const sp = find(db, "spaces", sid); if (!sp) throw new RuleError("Space not found", "spaceIds");
        if (["active", "notice", "draft"].includes(rec.status) && ["private_office", "dedicated_desk", "parking", "locker"].includes(sp.type))
          for (const c of db.contracts || []) {
            if (c.id === rec.id || !["active", "notice"].includes(c.status)) continue;
            if ((c.spaceIds || []).includes(sid) && c.start <= rec.end && rec.start <= c.end) throw new RuleError(`${sp.code} is already contracted to ${c.number} for those dates`, "spaceIds");
          }
      }
      rec.addons = (rec.addons || []).filter(a => a.name).map(a => Object.assign({}, a, { qty: num(a.qty === undefined ? 1 : a.qty, "Add-on quantity", 0), price: num(a.price === undefined ? 0 : a.price, "Add-on price", 0) }));
      setdef(rec, "termMonths", 12);
      numberIt(rec, old, "contracts", db, today);
    },
    bookings(rec, old, db, u, today, cfg) {
      const sp = find(db, "spaces", rec.spaceId);
      if (!sp) throw new RuleError("Choose a room or space", "spaceId");
      if (!S.BOOKABLE.includes(sp.type)) throw new RuleError(`${sp.name} cannot be booked by the hour`, "spaceId");
      if (sp.status === "maintenance" && rec.status !== "cancelled") throw new RuleError(`${sp.name} is under maintenance`, "spaceId");
      checkDt(rec.start, "Start"); checkDt(rec.end, "End");
      if (rec.end <= rec.start) throw new RuleError("End time must be after the start time", "end");
      if (rec.start.slice(0, 10) !== rec.end.slice(0, 10)) throw new RuleError("A booking must start and end on the same day", "end");
      if (hoursBetween(rec.start, rec.end) > 14) throw new RuleError("A booking can be at most 14 hours", "end");
      en(rec, "status", ["confirmed", "tentative", "cancelled", "checked_in"], "confirmed");
      rec.attendees = Math.trunc(num(rec.attendees || 1, "Attendees", 1));
      if (sp.capacity && rec.attendees > Number(sp.capacity)) throw new RuleError(`${sp.name} seats ${Math.trunc(Number(sp.capacity))}; you entered ${rec.attendees}`, "attendees");
      const m = rec.memberId ? find(db, "members", rec.memberId) : null;
      if (rec.memberId && !m) throw new RuleError("Member not found", "memberId");
      if (isMember(u)) {
        if (rec.memberId !== u.memberId) throw new RuleError("You can only book for yourself", "memberId", 403);
        if (!old && rec.start.slice(0, 10) < today) throw new RuleError("Choose a time in the future", "start");
      }
      if (rec.status !== "cancelled")
        for (const b of db.bookings || [])
          if (b.id !== rec.id && b.spaceId === rec.spaceId && b.status !== "cancelled" && b.start < rec.end && rec.start < b.end)
            throw new RuleError(`${sp.name} is already booked ${b.start.slice(11)}–${b.end.slice(11)}`, "start", 409);
      const extra = [];
      const changed = !old || ["start", "end", "spaceId", "memberId"].some(k => old[k] !== rec[k]) || ((old.status === "cancelled") !== (rec.status === "cancelled"));
      if (changed) {
        if (rec.status === "cancelled") { rec.creditsUsed = 0; rec.overageHours = 0; rec.overageAmount = 0; }
        else [rec.creditsUsed, rec.overageHours, rec.overageAmount] = priceBooking(rec, sp, m, db.bookings || [], db.plans || []);
        const ch = (db.charges || []).find(c => c.bookingId === rec.id) || null;
        if (ch && ch.invoiceId) { if (rec.overageAmount !== ch.amount) throw new RuleError("This booking's charge is already invoiced; issue a credit note instead", "start"); }
        else if (rec.overageAmount > 0 && (m || rec.companyId)) {
          const c2 = Object.assign({}, ch || { id: "CHG-" + rec.id });
          Object.assign(c2, { date: rec.start.slice(0, 10), bookingId: rec.id, memberId: rec.memberId || "", companyId: (m || {}).companyId || rec.companyId || "",
            desc: `${sp.name} booking ${fmtDate(rec.start.slice(0, 10))} ${rec.start.slice(11)}–${rec.end.slice(11)} (${fmtG(rec.overageHours)} h beyond credits)`,
            qty: rec.overageHours, price: r2(Number(sp.priceHour || 0)), amount: rec.overageAmount, vat: cfg.vatRate === undefined ? 5 : cfg.vatRate, invoiceId: "" });
          extra.push(["charges", c2, "put"]);
        } else if (ch) extra.push(["charges", ch, "delete"]);
      }
      return extra;
    },
    invoices(rec, old, db, u, today, cfg) {
      en(rec, "status", S.INVOICE_STATUS, "draft");
      if (old && old.status !== "draft") {
        const free = ["status", "paid", "dunningLevel", "lastReminder", "paymentLink", "voidReason", "voidedOn", "notes", "credited"];
        for (const k of Object.keys(old)) if (!free.includes(k) && stableStr(rec[k]) !== stableStr(old[k])) throw new RuleError("An issued tax invoice cannot be changed. Issue a credit note, or void it with a reason.", k);
        if (rec.status === "draft") throw new RuleError("An issued invoice cannot go back to draft", "status");
        if (rec.status === "void" && old.status !== "void") {
          if (!String(rec.voidReason || "").trim()) throw new RuleError("Give a reason for voiding", "voidReason");
          if (Number(old.paid || 0) > 0) throw new RuleError("This invoice has payments; issue a credit note instead of voiding", "status");
          rec.voidedOn = today;
        }
        return [];
      }
      if (!party(rec, db)) req(rec, "customerName", "Customer");
      checkDate(rec.date || today, "Invoice date"); setdef(rec, "date", today);
      rec.dueDate = checkDate(rec.dueDate || addDays(rec.date, Number(cfg.paymentTermsDays || 14)), "Due date");
      if (rec.dueDate < rec.date) throw new RuleError("Due date must be on or after the invoice date", "dueDate");
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      rec.paid = r2(rec.paid || 0); setdef(rec, "dunningLevel", 0);
      if (rec.status === "void") throw new RuleError("Delete a draft instead of voiding it", "status");
      if (rec.status !== "draft") {
        if (!rec.lines.length) throw new RuleError("Add at least one line before issuing", "lines");
        if (rec.total <= 0) throw new RuleError("The invoice total must be more than zero", "lines");
        rec.status = "issued"; rec.number = nextNumber("invoices", db, rec.date);
        rec.customer = partySnapshot(rec, db); rec.supplier = supplierSnapshot(cfg); rec.issuedOn = today;
      }
      return [];
    },
    creditnotes(rec, old, db, u, today, cfg) {
      if (old) throw new RuleError("A credit note cannot be changed once issued", "lines");
      const inv = find(db, "invoices", rec.invoiceId);
      if (!inv || ["draft", "void"].includes(inv.status)) throw new RuleError("Choose an issued invoice", "invoiceId");
      req(rec, "reason", "Reason"); checkDate(rec.date || today, "Date"); setdef(rec, "date", today);
      [rec.lines, rec.subtotal, rec.vatTotal, rec.total] = lineTotals(rec.lines, cfg.vatRate === undefined ? 5 : cfg.vatRate);
      if (rec.total <= 0) throw new RuleError("The credit note total must be more than zero", "lines");
      const bal = balance(inv, db);
      if (rec.total > bal + 0.004) throw new RuleError(`The credit note is more than the invoice balance (${bal.toFixed(2)})`, "lines");
      rec.number = nextNumber("creditnotes", db, rec.date);
      rec.companyId = inv.companyId || ""; rec.memberId = inv.memberId || "";
      rec.customer = inv.customer || partySnapshot(inv, db); rec.supplier = supplierSnapshot(cfg); rec.invoiceNumber = inv.number;
      const inv2 = Object.assign({}, inv, { credited: r2(Number(inv.credited || 0) + rec.total) });
      const db2 = Object.assign({}, db, { creditnotes: (db.creditnotes || []).concat([rec]) });
      return [["invoices", refresh(inv2, db2), "put"]];
    },
    receipts(rec, old, db, u, today) {
      if (old) throw new RuleError("A receipt cannot be changed; record a refund or credit note instead", "amount");
      const inv = find(db, "invoices", rec.invoiceId);
      if (!inv || ["draft", "void"].includes(inv.status)) throw new RuleError("Choose an issued invoice", "invoiceId");
      rec.amount = r2(num(rec.amount, "Amount", 0.01));
      en(rec, "method", S.PAY_METHODS, "bank_transfer"); checkDate(rec.date || today, "Date"); setdef(rec, "date", today);
      const bal = balance(inv, db);
      if (rec.amount > bal + 0.004) throw new RuleError(`The amount is more than the balance due (${bal.toFixed(2)})`, "amount");
      rec.number = nextNumber("receipts", db, rec.date);
      rec.companyId = inv.companyId || ""; rec.memberId = inv.memberId || ""; rec.invoiceNumber = inv.number; rec.customerName = (inv.customer || {}).name || "";
      const inv2 = Object.assign({}, inv, { paid: r2(Number(inv.paid || 0) + rec.amount) });
      return [["invoices", refresh(inv2, db), "put"]];
    },
    charges(rec, old, db, u, today, cfg) {
      req(rec, "desc", "Description");
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who to charge", "memberId");
      party(rec, db);
      if (old && old.invoiceId) throw new RuleError("This charge is already invoiced", "desc");
      rec.qty = num(rec.qty === undefined ? 1 : rec.qty, "Quantity", 0); rec.price = num(rec.price === undefined ? 0 : rec.price, "Price", 0);
      rec.amount = r2(rec.qty * rec.price); rec.vat = num(rec.vat === undefined ? (cfg.vatRate === undefined ? 5 : cfg.vatRate) : rec.vat, "VAT %", 0);
      rec.date = checkDate(rec.date || today, "Date"); setdef(rec, "invoiceId", "");
    },
    visitors(rec, old, db, u, today) {
      req(rec, "name", "Visitor name"); checkDate(rec.date || today, "Visit date"); setdef(rec, "date", today);
      en(rec, "status", ["expected", "checked_in", "checked_out", "cancelled"], "expected");
      if (isMember(u)) {
        if (rec.hostId !== u.memberId) throw new RuleError("You can only invite guests for yourself", "hostId", 403);
        if (old && old.status !== rec.status && rec.status !== "cancelled") throw new RuleError("Reception checks guests in", "status", 403);
      }
      if (rec.hostId && !find(db, "members", rec.hostId)) throw new RuleError("Host member not found", "hostId");
      numberIt(rec, old, "visitors", db, today);
      if (rec.status === "checked_in" && !rec.inAt) rec.inAt = rec.nowTime || "09:00";
      delete rec.nowTime;
    },
    checkins(rec, old, db, u, today) { if (!find(db, "members", rec.memberId)) throw new RuleError("Member not found", "memberId"); rec.date = checkDate(rec.date || today, "Date"); },
    mail(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who the mail is for", "companyId");
      party(rec, db); en(rec, "type", S.MAIL_TYPES, "letter"); en(rec, "status", S.MAIL_STATUS, "received");
      rec.received = checkDate(rec.received || today, "Received date"); req(rec, "sender", "Sender");
    },
    calls(rec, old, db, u, today) {
      if (!rec.companyId && !rec.memberId) throw new RuleError("Choose who the call was for", "companyId");
      party(rec, db); req(rec, "caller", "Caller name"); req(rec, "message", "Message"); en(rec, "status", ["new", "passed_on", "closed"], "new");
      setdef(rec, "when", today + "T09:00");
    },
    tickets(rec, old, db, u, today) {
      req(rec, "subject", "Subject"); en(rec, "category", S.TICKET_CATS, "maintenance"); en(rec, "priority", S.PRIORITIES, "normal"); en(rec, "status", S.TICKET_STATUS, "open");
      setdef(rec, "opened", today);
      if (isMember(u)) {
        if (rec.memberId !== u.memberId) throw new RuleError("You can only raise tickets for yourself", "memberId", 403);
        if (old) for (const k of new Set(Object.keys(old).concat(Object.keys(rec))))
          if (k !== "comments" && stableStr(old[k]) !== stableStr(rec[k]) && !(k === "status" && rec.status === "closed")) throw new RuleError("Only the centre team can change this ticket", k, 403);
      }
      if (["resolved", "closed"].includes(rec.status) && !rec.closedOn) rec.closedOn = today;
      numberIt(rec, old, "tickets", db, today);
    },
    access(rec) { req(rec, "cardNo", "Card number"); req(rec, "door", "Door"); en(rec, "result", ["granted", "denied"], "granted"); },
    outbox(rec) { req(rec, "to", "Recipient"); req(rec, "subject", "Subject"); en(rec, "status", ["queued", "sent_simulated", "cancelled"], "queued"); },
    addressuse(rec, old, db, u, today) {
      if (!find(db, "companies", rec.companyId)) throw new RuleError("Choose the company", "companyId");
      req(rec, "licenceNo", "Trade licence number"); checkDate(rec.from || today, "From"); setdef(rec, "from", today);
      if (rec.to) checkDate(rec.to, "To"); en(rec, "status", ["active", "ended"], "active");
    },
    cfg(rec) {
      if (rec.id === "centre") {
        req(rec, "legalName", "Centre legal name");
        if (!S.COUNTRY_PRESETS[rec.country]) throw new RuleError("Choose a country preset", "country");
        rec.vatRate = num(rec.vatRate === undefined ? 5 : rec.vatRate, "VAT rate", 0);
        if (!validTrn(rec.trn, rec)) throw new RuleError(`${rec.taxLabel || "TRN"}: must be ${rec.taxIdDigits} digits`, "trn");
        rec.paymentTermsDays = Math.trunc(num(rec.paymentTermsDays === undefined ? 14 : rec.paymentTermsDays, "Payment terms", 0));
      }
    },
  };
  function validate(coll, rec, old, db, user, today) { const f = V[coll]; return f ? (f(rec, old, db, user, today, cfgOf(db)) || []) : []; }
  const DEL = {
    invoices: r => r.status === "draft" || "Issued invoices cannot be deleted. Void it with a reason or issue a credit note.",
    creditnotes: () => "Credit notes cannot be deleted", receipts: () => "Receipts cannot be deleted",
    charges: r => !r.invoiceId || "This charge is already invoiced",
    contracts: r => ["draft", "cancelled"].includes(r.status) || "Only draft or cancelled contracts can be deleted. End it instead.",
    cfg: () => "Settings cannot be deleted",
  };
  const canDelete = (coll, rec) => { const f = DEL[coll]; if (!f) return true; const r = f(rec); return typeof r === "string" ? r : true; };

  const partyKey = x => x.companyId ? "c:" + x.companyId : "m:" + (x.memberId || "");
  function billingRun(db, period, today, cfg) {
    const [ps, pe] = monthBounds(period), rate = cfg.vatRate === undefined ? 5 : cfg.vatRate, terms = Number(cfg.paymentTermsDays || 14);
    const invs = {}, skipped = [];
    const billed = new Set((db.invoices || []).filter(i => i.status !== "void").map(i => i.contractId + "|" + i.periodStart));
    const spaces = Object.fromEntries((db.spaces || []).map(s => [s.id, s]));
    const invFor = p => { const k = partyKey(p); if (!invs[k]) invs[k] = { id: "", status: "draft", companyId: p.companyId || "", memberId: p.companyId ? "" : (p.memberId || ""), date: ps > today ? ps : today, dueDate: addDays(ps > today ? ps : today, terms), periodStart: ps, periodEnd: pe, lines: [], source: "billing_run", contractId: "", contractIds: [] }; return invs[k]; };
    const sorted = (db.contracts || []).slice().sort((a, b) => cmp(a.number || "", b.number || ""));
    for (const c of sorted) {
      if (!["active", "notice"].includes(c.status) || c.start > pe || c.end < ps) continue;
      if (billed.has(c.id + "|" + ps) || (db.invoices || []).some(i => (i.contractIds || []).includes(c.id) && i.periodStart === ps && i.status !== "void")) { skipped.push(c.number); continue; }
      const inv = invFor(c); inv.contractIds.push(c.id); if (!inv.contractId) inv.contractId = c.id;
      const codes = (c.spaceIds || []).filter(s => spaces[s]).map(s => spaces[s].code || "").join(", ");
      const [amt, days, total] = prorate(c.monthlyFee, c.start, c.end, ps, pe);
      const span = `${fmtDate(c.start > ps ? c.start : ps)} to ${fmtDate(c.end < pe ? c.end : pe)}`, note = days < total ? ` (prorated ${days}/${total} days)` : "";
      if (amt > 0) inv.lines.push({ desc: `${c.title || "Membership"}${codes ? " – " + codes : ""} · ${span}${note}`, qty: 1, price: amt, vat: c.vatExempt ? 0 : rate, kind: "fee", contractId: c.id });
      for (const a of c.addons || []) { const [aa] = prorate(r2(Number(a.qty) * Number(a.price)), c.start, c.end, ps, pe); if (aa > 0) inv.lines.push({ desc: `${a.name} · ${span}${note}`, qty: 1, price: aa, vat: rate, kind: "addon", contractId: c.id }); }
    }
    const chUpd = [];
    const chs = (db.charges || []).slice().sort((a, b) => cmp(a.date || "", b.date || "") || cmp(a.id, b.id));
    for (const ch of chs) {
      if (ch.invoiceId || (ch.date || "") > pe) continue;
      invFor(ch).lines.push({ desc: `${ch.desc} (${fmtDate(ch.date)})`, qty: ch.qty === undefined ? 1 : ch.qty, price: ch.price || 0, vat: ch.vat === undefined ? rate : ch.vat, kind: "charge", chargeId: ch.id });
      chUpd.push(ch);
    }
    const out = [];
    for (const k of Object.keys(invs).sort(cmp)) { const inv = invs[k]; if (!inv.lines.length) continue; [inv.lines, inv.subtotal, inv.vatTotal, inv.total] = lineTotals(inv.lines, rate); out.push(inv); }
    return [out, chUpd, skipped];
  }
  const dunningLevel = over => { let l = 0; S.DUNNING_DAYS.forEach((t, i) => { if (over >= t) l = i + 1; }); return l; };
  function dunningRun(db, today) {
    const out = [];
    for (const inv of (db.invoices || []).slice().sort((a, b) => cmp(a.number || "", b.number || ""))) {
      if (!["issued", "part_paid"].includes(inv.status)) continue;
      const bal = balance(inv, db); if (bal <= 0) continue;
      const over = daysBetween(inv.dueDate, today), lvl = dunningLevel(over);
      if (lvl > Number(inv.dunningLevel || 0)) out.push([inv, lvl, over, bal]);
    }
    return out;
  }
  function noticeDue(c, today) { const nd = addDays(c.end, -Number(c.noticeDays || 0)); return [nd, ["active", "notice"].includes(c.status) && today >= addDays(nd, -S.NOTICE_WINDOW_DAYS) && c.end >= today]; }
  function renewalOf(c, today, uplift) {
    const start = addDays(c.end, 1), months = Number(c.termMonths || 12), end = addDays(addMonths(start, months), -1);
    const fee = r2(Number(c.monthlyFee) * (1 + Number(uplift || 0) / 100));
    const keep = {}; for (const [k, v] of Object.entries(c)) if (!["id", "number", "status", "start", "end", "monthlyFee", "noticeReminded", "renewedTo", "_v", "renewals", "depositStatus"].includes(k)) keep[k] = v;
    return Object.assign(keep, { start, end, monthlyFee: fee, status: "active", renewedFrom: c.id, depositStatus: c.depositStatus || "not_due" });
  }
  const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  return { RuleError, r2, addDays, addMonths, monthBounds, daysBetween, fmtDate, validDate, hoursBetween, num, checkDate, lineTotals, prorate, validTrn,
    cfgOf, allowance, creditsUsed, creditsLeft, priceBooking, nextNumber, partySnapshot, balance, validate, canDelete, billingRun, dunningRun, dunningLevel,
    noticeDue, renewalOf, find, fmtG };
})();

/* ===== 03-backend.js ===== */
/* Two backends with the same interface:
   ServerBackend  -> Flask API (server edition)
   LocalBackend   -> runs the same rules inside the browser, data in IndexedDB (offline single-file edition). */
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const localHM = () => { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
class ApiError extends Error { constructor(msg, status, field, extra) { super(msg); this.status = status; this.field = field; this.extra = extra || {}; } }

const ServerBackend = {
  kind: "server",
  async call(method, url, body) {
    let r;
    try { r = await fetch(url, { method, headers: { "Content-Type": "application/json", "X-Immora": "1" }, credentials: "same-origin", body: body === undefined ? undefined : JSON.stringify(body) }); }
    catch (e) { throw new ApiError(t("Cannot reach the Immora BCS server. Check that it is running."), 0); }
    let j = {}; try { j = await r.json(); } catch (e) { /* not json */ }
    if (!r.ok) throw new ApiError(j.error || `Error ${r.status}`, r.status, j.field, j);
    return j;
  },
  async me() { try { return (await this.call("GET", "api/me")).user; } catch (e) { return null; } },
  login(u, p, portal) { return this.call("POST", "api/login", { username: u, password: p, portal: !!portal }).then(j => j.user); },
  logout() { return this.call("POST", "api/logout", {}); },
  state() { return this.call("GET", "api/state"); },
  sync(changes) { return this.call("POST", "api/sync", { changes }); },
  action(name, payload) { return this.call("POST", "api/action/" + name, payload || {}); },
  users() { return this.call("GET", "api/users").then(j => j.users); },
  saveUser(u) { return this.call("POST", "api/users", u); },
  password(o, n) { return this.call("POST", "api/password", { old: o, new: n }); },
  setLang(l) { return this.call("POST", "api/lang", { lang: l }).catch(() => {}); },
  audit() { return this.call("GET", "api/audit?limit=500").then(j => j.audit); },
  async backup() { const r = await fetch("api/backup", { credentials: "same-origin" }); if (!r.ok) throw new ApiError("Backup failed", r.status); return r.text(); },
  restore(obj) { return this.call("POST", "api/restore", { backup: obj }); },
};

/* ---------- PBKDF2-SHA256 (WebCrypto, with a small pure-JS fallback for browsers that block it on file://) */
const SHA = (() => {
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function sha256(bytes) {
    const l = bytes.length, n = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(n); m.set(bytes); m[l] = 0x80;
    const dv = new DataView(m.buffer); dv.setUint32(n - 4, l * 8); dv.setUint32(n - 8, Math.floor(l / 0x20000000));
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]; const w = new Uint32Array(64);
    for (let o = 0; o < n; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) { const a = w[i - 15], b = w[i - 2]; const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3), s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, b, c, d, e, f, g, hh] = H;
      for (let i = 0; i < 64; i++) { const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)), ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + w[i]) | 0, S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0; hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0; }
      H = [H[0] + a, H[1] + b, H[2] + c, H[3] + d, H[4] + e, H[5] + f, H[6] + g, H[7] + hh].map(x => x | 0);
    }
    const out = new Uint8Array(32); const ov = new DataView(out.buffer); H.forEach((x, i) => ov.setUint32(i * 4, x >>> 0)); return out;
  }
  function hmac(key, msg) { if (key.length > 64) key = sha256(key); const k = new Uint8Array(64); k.set(key); const ip = k.map(x => x ^ 0x36), op = k.map(x => x ^ 0x5c); const a = new Uint8Array(64 + msg.length); a.set(ip); a.set(msg, 64); const inner = sha256(a); const b = new Uint8Array(96); b.set(op); b.set(inner, 64); return sha256(b); }
  function pbkdf2js(pw, salt, it) { const s = new Uint8Array(salt.length + 4); s.set(salt); s[salt.length + 3] = 1; let u = hmac(pw, s); const t = u.slice(); for (let i = 1; i < it; i++) { u = hmac(pw, u); for (let j = 0; j < 32; j++) t[j] ^= u[j]; } return t; }
  const b64 = a => btoa(String.fromCharCode.apply(null, Array.from(a))), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function pbkdf2(pw, salt, it) {
    const p = new TextEncoder().encode(pw);
    try { if (window.crypto && crypto.subtle) { const k = await crypto.subtle.importKey("raw", p, "PBKDF2", false, ["deriveBits"]); return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: it }, k, 256)); } } catch (e) { /* fall back */ }
    return pbkdf2js(p, salt, it);
  }
  async function hash(pw, it) { const salt = new Uint8Array(16); crypto.getRandomValues(salt); it = it || 100000; return `pbkdf2_sha256$${it}$${b64(salt)}$${b64(await pbkdf2(pw, salt, it))}`; }
  async function check(pw, stored) { try { const [algo, it, salt, hv] = stored.split("$"); if (algo !== "pbkdf2_sha256") return false; return b64(await pbkdf2(pw, unb64(salt), Number(it))) === hv; } catch (e) { return false; } }
  return { sha256, hash, check };
})();

/* ---------- IndexedDB key/value (falls back to localStorage) */
const KV = {
  db: null,
  open() { return new Promise(res => { try { const r = indexedDB.open("immora-bcs", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => { this.db = r.result; res(true); }; r.onerror = () => res(false); } catch (e) { res(false); } }); },
  async get(k) { if (!this.db) await this.open(); if (!this.db) { const v = localStorage.getItem("immora-bcs:" + k); return v ? JSON.parse(v) : null; } return new Promise(res => { const q = this.db.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); },
  async put(k, v) { if (!this.db) await this.open(); if (!this.db) { localStorage.setItem("immora-bcs:" + k, JSON.stringify(v)); return; } return new Promise((res, rej) => { const tx = this.db.transaction("kv", "readwrite"); tx.objectStore("kv").put(v, k); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); },
};

function shiftSeed(seed, base, today) {
  /* Demo data was generated for SEED_BASE; move it to today so the calendar, overdue invoices and renewals look current.
     Day-based lists move by days; month-based billing lists move by whole months (keeps 1st/last day of month). */
  const dd = R.daysBetween(base, today); const [by, bm] = base.split("-").map(Number), [ty, tm] = today.split("-").map(Number); const mm = (ty - by) * 12 + (tm - bm);
  if (!dd) return seed;
  const DAYC = new Set(["bookings", "visitors", "checkins", "access", "tours", "calls", "outbox", "charges", "tickets", "mail"]);
  const shiftM = s => { const d0 = Number(s.slice(8, 10)), [y, m] = s.slice(0, 7).split("-").map(Number); const last = d0 === new Date(Date.UTC(y, m, 0)).getUTCDate(); let x = R.addMonths(s.slice(0, 10), mm); if (last) x = R.monthBounds(x)[1]; return x + s.slice(10); };
  const walk = (v, f) => { if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}($|T\d{2}:\d{2})/.test(v)) return f(v); if (Array.isArray(v)) return v.map(x => walk(x, f)); if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v)) o[k] = walk(v[k], f); return o; } return v; };
  const out = {};
  for (const [c, list] of Object.entries(seed)) {
    const f = DAYC.has(c) ? (s => R.addDays(s.slice(0, 10), dd) + s.slice(10)) : shiftM;
    out[c] = c === "cfg" ? list : list.map(r => walk(r, f));
    if (c === "contracts") out[c] = out[c].map(r => Object.assign(r, { start: r.start, end: r.end }));
  }
  return out;
}

const LocalBackend = {
  kind: "offline", st: null, user: null,
  async load() {
    if (this.st) return this.st;
    let st = await KV.get("state");
    if (!st) {
      const data = shiftSeed(clone(SEED), SEED_BASE, localToday());
      st = { records: data, ver: {}, users: clone(DEMO_USERS), audit: [], created: localToday() };
      for (const [c, l] of Object.entries(data)) for (const r of l) st.ver[c + "|" + r.id] = 1;
      await KV.put("state", st);
    }
    for (const c of SHARED.COLLECTIONS) if (!st.records[c]) st.records[c] = [];
    this.st = st; return st;
  },
  async save() { await KV.put("state", this.st); },
  log(action, coll, rid, summary) { this.st.audit.unshift({ ts: new Date().toISOString().slice(0, 19), username: (this.user || {}).username || "system", action, coll: coll || "", rid: rid || "", summary: String(summary || "").slice(0, 500) }); if (this.st.audit.length > 5000) this.st.audit.length = 5000; },
  async me() { await this.load(); const u = sessionStorage.getItem("immora-bcs-user"); const x = u && this.st.users.find(z => z.username === u && z.active !== false); this.user = x ? this.pub(x) : null; return this.user; },
  pub(x) { return { username: x.username, name: x.name, role: x.role, memberId: x.memberId || "", lang: x.lang || "" }; },
  async login(u, p, portal) {
    await this.load(); u = String(u || "").trim().toLowerCase();
    const x = this.st.users.find(z => z.username === u);
    if (x && x.lockedUntil && x.lockedUntil > Date.now()) throw new ApiError(t("Too many wrong passwords. Try again in 5 minutes."), 429);
    if (!x || x.active === false || !(await SHA.check(p, x.hash))) { if (x) { x.failed = (x.failed || 0) + 1; if (x.failed >= 5) { x.failed = 0; x.lockedUntil = Date.now() + 300000; } } this.log("login_failed", "", "", u); await this.save(); throw new ApiError(t("Wrong username or password"), 401); }
    if (!!portal !== (x.role === "member")) throw new ApiError(x.role === "member" ? t("Use the member portal tab to sign in as a member") : t("Staff sign in on the staff tab"), 401);
    x.failed = 0; x.lockedUntil = 0; sessionStorage.setItem("immora-bcs-user", u); this.user = this.pub(x); this.log("login"); await this.save(); return this.user;
  },
  async logout() { sessionStorage.removeItem("immora-bcs-user"); this.user = null; },
  async state() {
    await this.load(); const u = this.user; if (!u) throw new ApiError("Please sign in", 401);
    const withV = (c, l) => l.map(r => Object.assign({}, r, { _v: this.st.ver[c + "|" + r.id] || 1 }));
    let data;
    if (u.role === "member") data = memberView(this.st.records, u.memberId, (c, l) => withV(c, l));
    else { data = {}; for (const c of SHARED.COLLECTIONS) data[c] = withV(c, this.st.records[c]); }
    return { data: clone(data), today: localToday(), now: localHM(), user: u };
  },
  canWrite(c) { return (SHARED.WRITE[this.user.role] || []).includes(c); },
  applyChanges(changes, today) {
    const db = clone(this.st.records), ver = Object.assign({}, this.st.ver), out = {}, logs = [];
    const bump = (c, id) => { ver[c + "|" + id] = (ver[c + "|" + id] || 0) + 1; return ver[c + "|" + id]; };
    const memPut = (c, r) => { const l = db[c]; const i = l.findIndex(x => x.id === r.id); if (i < 0) l.push(r); else l[i] = r; };
    const memDel = (c, id) => { db[c] = db[c].filter(x => x.id !== id); };
    const u = this.user;
    for (const ch of changes || []) {
      const c = ch.coll, op = ch.op || "put";
      if (!SHARED.COLLECTIONS.includes(c)) throw new ApiError("Unknown list: " + c, 400);
      if (!this.canWrite(c)) throw new ApiError(t("Your role cannot change this. Ask an administrator."), 403);
      const rid = String(ch.id || (ch.data || {}).id || "");
      if (!/^[A-Za-z0-9_.:-]{1,64}$/.test(rid)) throw new ApiError("Invalid record id", 400);
      const old = db[c].find(x => x.id === rid) || null;
      if (ch.base && old && Number(ch.base) !== ver[c + "|" + rid]) throw new ApiError(t("Someone else changed this record a moment ago. The screen now shows the latest version."), 409);
      if (u.role === "member" && old && !memberOwns(u, c, old)) throw new ApiError("This record is not yours", 403);
      if (op === "delete") {
        if (!old) continue;
        const ok = R.canDelete(c, old); if (ok !== true) throw new ApiError(ok, 400);
        if (u.role === "member") throw new ApiError("Cancel the booking instead of deleting it", 403);
        memDel(c, rid); out[c + "|" + rid] = { coll: c, id: rid, deleted: true, version: bump(c, rid), data: null }; logs.push(["delete", c, rid, describe(c, old)]);
        if (c === "bookings") for (const chg of db.charges.filter(x => x.bookingId === rid && !x.invoiceId)) { memDel("charges", chg.id); out["charges|" + chg.id] = { coll: "charges", id: chg.id, deleted: true, version: bump("charges", chg.id), data: null }; }
        continue;
      }
      const rec = clone(ch.data || {}); delete rec._v; rec.id = rid;
      let extras;
      try { extras = R.validate(c, rec, old, db, u, today); } catch (e) { if (e instanceof R.RuleError) throw new ApiError(e.message, e.status, e.field); throw e; }
      for (const [c2, r2, op2] of [[c, rec, "put"]].concat(extras || [])) {
        if (op2 === "delete") { memDel(c2, r2.id); out[c2 + "|" + r2.id] = { coll: c2, id: r2.id, deleted: true, version: bump(c2, r2.id), data: null }; continue; }
        const old2 = db[c2].find(x => x.id === r2.id);
        memPut(c2, r2); out[c2 + "|" + r2.id] = { coll: c2, id: r2.id, deleted: false, version: bump(c2, r2.id), data: r2 };
        if (c2 === c) logs.push([old2 ? "update" : "create", c2, r2.id, describe(c2, r2) + (old2 && old2.status !== r2.status && r2.status ? ` · ${old2.status} → ${r2.status}` : "")]);
      }
    }
    this.st.records = db; this.st.ver = ver; for (const l of logs) this.log(...l);
    return Object.values(out);
  },
  async sync(changes) { await this.load(); if (!this.user) throw new ApiError("Please sign in", 401); const recs = this.applyChanges(changes, localToday()); await this.save(); return { records: clone(recs) }; },
  async action(name, p) {
    await this.load(); const u = this.user; if (!u) throw new ApiError("Please sign in", 401);
    if (!SHARED.ACTIONS[name]) throw new ApiError("Unknown action", 404);
    if (!SHARED.ACTIONS[name].includes(u.role)) throw new ApiError(t("Your role cannot do this. Ask an administrator."), 403);
    const res = localAction(this, name, p || {}, localToday(), localHM()); await this.save(); return clone(res);
  },
  async users() { await this.load(); return this.st.users.map(x => ({ username: x.username, name: x.name, role: x.role, active: x.active !== false ? 1 : 0, memberId: x.memberId || "" })); },
  async saveUser(b) {
    if (this.user.role !== "admin") throw new ApiError("Only an administrator can do this", 403);
    const un = String(b.username || "").trim().toLowerCase();
    if (!un || !/^[a-z0-9._-]+$/.test(un)) throw new ApiError("Username: letters and numbers only", 400, "username");
    if (!SHARED.ROLES.concat(["member"]).includes(b.role)) throw new ApiError("Choose a role", 400, "role");
    let x = this.st.users.find(z => z.username === un);
    if (b.password && b.password.length < 8) throw new ApiError("Use at least 8 characters", 400, "password");
    if (!x && !b.password) throw new ApiError("Set a password for the new user", 400, "password");
    if (b.role === "member" && !this.st.records.members.some(m => m.id === b.memberId)) throw new ApiError("Choose the member for this portal login", 400, "memberId");
    if (x && x.username === this.user.username && (b.role !== "admin" || b.active === false)) throw new ApiError("You cannot remove your own administrator access", 400);
    if (!x) { x = { username: un }; this.st.users.push(x); }
    Object.assign(x, { name: String(b.name || un).slice(0, 80), role: b.role, active: b.active !== false, memberId: b.memberId || "" });
    if (b.password) x.hash = await SHA.hash(b.password);
    this.log("user_saved", "users", un, `${un} · ${b.role}${b.password ? " · password set" : ""}`); await this.save(); return { ok: true };
  },
  async password(o, n) { const x = this.st.users.find(z => z.username === this.user.username); if (!(await SHA.check(o, x.hash))) throw new ApiError("Current password is wrong", 400, "old"); if (!n || n.length < 8) throw new ApiError("Use at least 8 characters", 400, "new"); x.hash = await SHA.hash(n); this.log("password_changed"); await this.save(); return { ok: true }; },
  async setLang(l) { const x = this.st.users.find(z => z.username === (this.user || {}).username); if (x) { x.lang = l; await this.save(); } },
  async audit() { return this.st.audit.slice(0, 500); },
  async backup() { this.log("backup"); await this.save(); return JSON.stringify({ app: "Immora BCS", version: APP_VERSION, created: new Date().toISOString().slice(0, 19), data: this.st.records }); },
  async restore(obj) { const d = (obj || {}).data; if (!d || !d.cfg) throw new ApiError("This is not an Immora BCS backup file", 400); this.st.records = {}; this.st.ver = {}; for (const c of SHARED.COLLECTIONS) { this.st.records[c] = (d[c] || []).filter(r => r && /^[A-Za-z0-9_.:-]{1,64}$/.test(String(r.id))); for (const r of this.st.records[c]) this.st.ver[c + "|" + r.id] = 1; } this.log("restore", "", "", "backup restored"); await this.save(); return { ok: true }; },
  async resetDemo() { const data = shiftSeed(clone(SEED), SEED_BASE, localToday()); this.st.records = data; this.st.ver = {}; for (const [c, l] of Object.entries(data)) for (const r of l) this.st.ver[c + "|" + r.id] = 1; this.log("demo_reset"); await this.save(); },
};

function describe(c, r) { r = r || {}; for (const f of ["number", "code", "legalName", "name", "subject", "title", "desc"]) if (r[f]) return String(r[f]); return r.id || ""; }
function memberOwns(u, c, r) { const m = u.memberId; return c === "bookings" || c === "tickets" ? r.memberId === m : c === "visitors" ? r.hostId === m : false; }
const PUBLIC_CFG = ["id", "legalName", "tradeName", "address", "trn", "phone", "email", "currency", "vatRate", "taxLabel", "invoiceTitle", "country", "openFrom", "openTo", "licenceNo", "logo", "stamp", "bank", "paymentTermsDays", "vatName", "footer"];
function memberView(db, mid, withV) {
  const me = db.members.find(m => m.id === mid) || null, comp = (me && me.companyId) || "__none__";
  const mine = r => r.memberId === mid || (r.companyId && r.companyId === comp);
  const out = {}; for (const c of SHARED.COLLECTIONS) out[c] = [];
  out.cfg = db.cfg.filter(r => r.id === "centre").map(r => Object.fromEntries(Object.entries(r).filter(([k]) => PUBLIC_CFG.includes(k))));
  out.spaces = db.spaces.filter(s => SHARED.BOOKABLE.includes(s.type)).map(s => Object.fromEntries(["id", "code", "name", "type", "floor", "capacity", "priceHour", "creditRate", "status", "amenities"].map(k => [k, s[k] === undefined ? null : s[k]])));
  out.plans = db.plans.filter(p => me && p.id === me.planId); out.members = me ? [me] : []; out.companies = db.companies.filter(x => x.id === comp);
  for (const b of db.bookings) { if (b.status === "cancelled" && b.memberId !== mid) continue; out.bookings.push(b.memberId === mid ? b : { id: b.id, spaceId: b.spaceId, start: b.start, end: b.end, status: b.status, title: "Booked", private: true }); }
  for (const k of ["invoices", "creditnotes", "receipts"]) out[k] = db[k].filter(x => mine(x) && x.status !== "draft");
  out.tickets = db.tickets.filter(x => x.memberId === mid); out.visitors = db.visitors.filter(x => x.hostId === mid);
  out.mail = db.mail.filter(mine); out.calls = db.calls.filter(mine);
  for (const c of Object.keys(out)) out[c] = withV(c, out[c]);
  return out;
}

function localAction(B, name, p, today, hm) {
  const db = B.st.records, cfgc = R.cfgOf(db); let n = 0;
  const id = pre => `${pre}-${today.replace(/-/g, "")}-${pad2(++n)}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const put = items => B.applyChanges(items.map(([c, r]) => ({ coll: c, id: r.id, op: "put", data: r })), today);
  const E = m => { throw new ApiError(m, 400); };
  if (name === "billing_run") {
    const period = (p.period || today).slice(0, 10); if (!R.validDate(period)) E("Billing month: use a valid date (DD-MM-YYYY)");
    const [invs, charges, skipped] = R.billingRun(db, period, today, cfgc), items = [];
    for (const inv of invs) { inv.id = id("INV"); items.push(["invoices", inv]); for (const ln of inv.lines) if (ln.chargeId) items.push(["charges", Object.assign({}, charges.find(x => x.id === ln.chargeId), { invoiceId: inv.id })]); }
    const recs = items.length ? put(items) : []; B.log("billing_run", "invoices", "", `${period.slice(0, 7)}: ${invs.length} draft invoice(s); skipped ${skipped.length}`);
    return { records: recs, created: invs.length, skipped };
  }
  if (name === "dunning_run") {
    const due = R.dunningRun(db, today), items = [];
    for (const [inv, lvl, over, bal] of due) {
      const cust = inv.customer || {};
      items.push(["invoices", Object.assign({}, inv, { dunningLevel: lvl, lastReminder: today })]);
      items.push(["outbox", { id: id("OUT"), to: cust.email || cust.name || "client", status: "queued", date: today, kind: "dunning", invoiceId: inv.id, level: lvl,
        subject: ["", "Friendly reminder", "Second reminder", "Final notice"][lvl] + `: invoice ${inv.number} is ${over} day(s) overdue`,
        body: `Dear ${cust.name || "client"},\n\nOur records show ${cfgc.currency || "AED"} ${bal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is still due on invoice ${inv.number} dated ${R.fmtDate(inv.date)} (due ${R.fmtDate(inv.dueDate)}).\nPlease arrange payment or contact us if you have already paid.\n\n${cfgc.legalName || ""}` }]);
    }
    return { records: items.length ? put(items) : [], created: due.length };
  }
  if (name === "notice_reminders") {
    const items = []; let k = 0;
    for (const c of db.contracts) {
      const [nd, inwin] = R.noticeDue(c, today); if (!inwin || c.noticeReminded) continue; k++;
      const pty = R.partySnapshot(c, db);
      items.push(["contracts", Object.assign({}, c, { noticeReminded: today })]);
      items.push(["outbox", { id: id("OUT"), to: pty.email || pty.name || "client", status: "queued", date: today, kind: "notice", contractId: c.id,
        subject: `Your agreement ${c.number} ends on ${R.fmtDate(c.end)}: renewal or notice by ${R.fmtDate(nd)}`,
        body: `Dear ${pty.name},\n\nYour agreement ${c.number} ends on ${R.fmtDate(c.end)}. Under its ${c.noticeDays}-day notice period, please tell us by ${R.fmtDate(nd)} whether you will renew.\n\n${cfgc.legalName || ""}` }]);
    }
    return { records: items.length ? put(items) : [], created: k };
  }
  if (name === "renew_contract") {
    const old = db.contracts.find(x => x.id === p.id); if (!old || !["active", "notice"].includes(old.status)) E("Only active contracts can be renewed");
    const nw = R.renewalOf(old, today, p.uplift || 0); nw.id = id("CT");
    return { records: put([["contracts", Object.assign({}, old, { status: "renewed", renewedTo: nw.id })], ["contracts", nw]]), id: nw.id };
  }
  if (name === "convert_lead") {
    const lead = db.leads.find(x => x.id === p.id); if (!lead) E("Lead not found"); if (lead.memberId) E("This lead is already a member");
    const items = []; let cid = "";
    if (String(lead.company || "").trim()) { cid = id("CO"); items.push(["companies", { id: cid, legalName: lead.company.trim(), email: lead.email || "", phone: lead.phone || "", status: "active", since: today }]); }
    const mid = id("M");
    items.push(["members", { id: mid, name: lead.name, email: lead.email || "", phone: lead.phone || "", companyId: cid, planId: p.planId || "", status: "active", start: today, leadId: lead.id }]);
    items.push(["leads", Object.assign({}, lead, { stage: "won", memberId: mid, companyId: cid, wonOn: today })]);
    return { records: put(items), memberId: mid, companyId: cid };
  }
  if (name === "card_tap") {
    const card = String(p.cardNo || "").trim(), door = p.door || "Main entrance";
    const m = db.members.find(x => x.cardNo === card) || null;
    const ok = !!(m && m.status === "active" && !m.cardBlocked), reason = ok ? "" : (!m ? "Unknown card" : m.cardBlocked ? "Card blocked" : "Membership not active");
    const items = [["access", { id: id("ACC"), cardNo: card || "?", memberId: (m || {}).id || "", door, at: `${today}T${hm}`, result: ok ? "granted" : "denied", reason, simulated: true }]];
    if (ok && door === "Main entrance" && !db.checkins.some(x => x.memberId === m.id && x.date === today)) items.push(["checkins", { id: id("CHK"), memberId: m.id, date: today, time: hm, via: "card" }]);
    return { records: put(items), result: ok ? "granted" : "denied", reason, member: (m || {}).name || "" };
  }
  if (name === "payment_link") {
    const inv = db.invoices.find(x => x.id === p.id); if (!inv || !["issued", "part_paid"].includes(inv.status)) E("Choose an unpaid issued invoice");
    const link = `https://pay.example.invalid/${inv.number}?amount=${R.balance(inv, db).toFixed(2)}`;
    return { records: put([["invoices", Object.assign({}, inv, { paymentLink: link })]]), link };
  }
}

/* ===== 10-shell.js ===== */
/* App shell: sign-in, layout, navigation, router, forms, modals, command palette, guided tour. */
let DB = {}, VER = {}, ME = null, TODAY = localToday(), NOW = localHM();
const Backend = BUILD_MODE === "server" ? ServerBackend : LocalBackend;
const PAGES = {}, AFTER = {}, ACT = {}, FORMS = {}, LIVE = {};
const can = c => !!ME && (SHARED.WRITE[ME.role] || []).includes(c);
const canAct = a => !!ME && (SHARED.ACTIONS[a] || []).includes(ME.role);
const isStaff = () => ME && ME.role !== "member";

function loadState(res) {
  DB = {}; VER = {};
  for (const c of SHARED.COLLECTIONS) { DB[c] = (res.data[c] || []).map(r => { const x = Object.assign({}, r); VER[c + "|" + x.id] = x._v || 1; delete x._v; return x; }); }
  TODAY = res.today || localToday(); NOW = res.now || localHM();
}
function applyRecords(recs) {
  for (const r of recs || []) {
    const l = DB[r.coll] || (DB[r.coll] = []); const i = l.findIndex(x => x.id === r.id);
    if (r.deleted) { if (i >= 0) l.splice(i, 1); delete VER[r.coll + "|" + r.id]; continue; }
    VER[r.coll + "|" + r.id] = r.version; if (i >= 0) l[i] = r.data; else l.push(r.data);
  }
}
async function refresh() { try { loadState(await Backend.state()); } catch (e) { if (e.status === 401) return sessionEnded(); } render(); }
async function save(coll, rec, opts) {
  opts = opts || {};
  if (!rec.id) rec.id = uid(coll.slice(0, 3).toUpperCase());
  try {
    const res = await Backend.sync([{ coll, id: rec.id, op: "put", base: VER[coll + "|" + rec.id] || 0, data: rec }]);
    applyRecords(res.records); if (opts.toast !== false) toast(opts.msg || t("Saved"));
    const mine = res.records.find(r => r.coll === coll && r.id === rec.id); return mine ? mine.data : rec;
  } catch (e) { return fail(e, opts.form); }
}
async function saveMany(items, msg) {
  try { const res = await Backend.sync(items.map(([c, r, op]) => ({ coll: c, id: r.id || (r.id = uid(c.slice(0, 3).toUpperCase())), op: op || "put", base: VER[c + "|" + r.id] || 0, data: r }))); applyRecords(res.records); if (msg) toast(msg); return true; }
  catch (e) { return fail(e); }
}
async function remove(coll, id, msg) {
  try { const res = await Backend.sync([{ coll, id, op: "delete", base: VER[coll + "|" + id] || 0 }]); applyRecords(res.records); toast(msg || t("Deleted")); return true; } catch (e) { return fail(e); }
}
async function act(name, payload, msg) {
  try { const res = await Backend.action(name, payload); applyRecords(res.records); if (msg) toast(typeof msg === "function" ? msg(res) : msg); return res; } catch (e) { return fail(e); }
}
function fail(e, form) {
  if (e.status === 401) { sessionEnded(); return null; }
  if (e.status === 409 && e.extra && e.extra.conflict) refresh();
  if (form && e.field) fieldError(form, e.field, e.message);
  toast(e.message || String(e), "err"); return null;
}
function sessionEnded() { ME = null; DB = {}; closeModal(); renderLogin(t("Your session ended. Please sign in again.")); }

/* ---------------------------------------------------------------- navigation */
const NAV = [
  { id: "home", label: "Home", icon: "home", items: [["dashboard", "Dashboard", "home"]] },
  { id: "spaces", label: "Spaces", icon: "map", items: [["floorplan", "Floor plan", "map"], ["spaces", "Spaces & prices", "grid"], ["plans", "Plans & add-ons", "coffee"]] },
  { id: "book", label: "Bookings", icon: "cal", items: [["calendar", "Room calendar", "cal"], ["bookings", "All bookings", "file"]] },
  { id: "crm", label: "Members & sales", icon: "users", items: [["members", "Members", "users"], ["companies", "Companies", "building"], ["leads", "Lead pipeline", "funnel"], ["tours", "Tours", "door"], ["quotes", "Quotes", "file"]] },
  { id: "contracts", label: "Contracts", icon: "file", items: [["contracts", "Contracts", "file"], ["renewals", "Renewals & notices", "bell"]] },
  { id: "vo", label: "Virtual office", icon: "mail", items: [["addressuse", "Business address use", "building"], ["mail", "Mail log", "mail"], ["calls", "Call answering", "phone"]] },
  { id: "billing", label: "Billing", icon: "bill", items: [["invoices", "Invoices", "bill"], ["billingrun", "Billing run", "refresh"], ["charges", "Charges & add-ons", "coffee"], ["receipts", "Receipts", "receipt"], ["creditnotes", "Credit notes", "file"], ["dunning", "Overdue & reminders", "alert"], ["books", "Export to Immora Books", "download"]] },
  { id: "desk", label: "Front desk", icon: "door", items: [["checkin", "Check-in", "check"], ["visitors", "Visitors", "qr"], ["access", "Access-card log", "card"]] },
  { id: "help", label: "Helpdesk", icon: "tool", items: [["tickets", "Tickets", "ticket"]] },
  { id: "reports", label: "Reports", icon: "chart", items: [["reports", "Reports", "chart"]] },
  { id: "admin", label: "Administration", icon: "cog", items: [["settings", "Centre settings", "cog"], ["users", "Users & logins", "key"], ["outbox", "Outbox (simulated)", "send"], ["audit", "Audit trail", "file"], ["backup", "Backup & restore", "download"]] },
];
const ROUTE_ROLES = {
  settings: ["admin"], users: ["admin"], backup: ["admin"], audit: ["admin", "finance"], billingrun: ["admin", "finance", "viewer"], books: ["admin", "finance", "viewer"],
  dunning: ["admin", "finance", "viewer"],
};
const PORTAL_NAV = [["p-home", "Home", "home"], ["p-book", "Book a room", "cal"], ["p-bookings", "My bookings", "file"], ["p-invoices", "Invoices", "bill"], ["p-tickets", "Help & requests", "ticket"], ["p-visitors", "My guests", "qr"], ["p-mail", "Mail for me", "mail"]];
const routeOK = r => !ROUTE_ROLES[r] || ROUTE_ROLES[r].includes(ME.role);
const ROUTE_TITLE = {}; NAV.forEach(g => g.items.forEach(([r, l]) => ROUTE_TITLE[r] = l)); PORTAL_NAV.forEach(([r, l]) => ROUTE_TITLE[r] = l);
function go(r) { if (location.hash === "#/" + r) render(); else location.hash = "#/" + r; }
function curRoute() { const p = (location.hash || "").replace(/^#\/?/, "").split("/"); return { name: p[0] || (ME && ME.role === "member" ? "p-home" : "dashboard"), arg: decodeURIComponent(p.slice(1).join("/") || "") }; }

/* ---------------------------------------------------------------- sign-in */
function renderLogin(msg) {
  document.body.className = "is-login";
  const demo = BUILD_MODE === "offline" || (window.__INFO && window.__INFO.demo);
  const chips = [["admin", "admin123"], ["frontdesk", "frontdesk123"], ["community", "community123"], ["finance", "finance123"], ["viewer", "viewer123"]];
  $("#app").innerHTML = `<div class="login">
    <section class="login-brand"><img class="login-logo" src="${IMMORA_LOGO.icon}" alt="Immora"><h1>Immora <span>BCS</span></h1>
      <p class="lead">${t("Business Centre System")}</p><p>${t("Designed to support coworking spaces, business centres and office rental operators: spaces, bookings, members, contracts, virtual offices and billing in one place.")}</p>
      <ul class="login-points"><li>${ic("map")} ${t("Floor plan and live availability")}</li><li>${ic("cal")} ${t("Meeting rooms with credits")}</li><li>${ic("bill")} ${t("Recurring billing and tax invoices")}</li><li>${ic("door")} ${t("Front desk, visitors and mail")}</li></ul></section>
    <section class="login-card card">
      <div class="login-tools"><span class="top-lang">${langSelect()}</span><button class="btn-icon" data-act="theme" title="${t("Light / dark")}" aria-label="${t("Light / dark")}">${ic(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button></div>
      <div class="tabs" role="tablist"><button role="tab" class="tab ${window.__portalTab ? "" : "on"}" data-act="login-tab" data-portal="0" id="tab-staff">${t("Staff sign in")}</button><button role="tab" class="tab ${window.__portalTab ? "on" : ""}" data-act="login-tab" data-portal="1" id="tab-portal">${t("Member portal")}</button></div>
      <form data-form="login" id="login-form" autocomplete="on" novalidate>
        ${msg ? `<div class="note warn">${h(msg)}</div>` : ""}
        ${fld(t("Username"), `<input name="username" id="login-user" autocomplete="username" required autofocus>`)}
        ${fld(t("Password"), `<input name="password" id="login-pass" type="password" autocomplete="current-password" required>`)}
        <button class="btn btn-primary btn-block" id="login-btn">${t("Sign in")}</button>
        <p class="login-err" id="login-err" role="alert"></p>
      </form>
      ${demo ? `<div class="demo-box"><b>${t("Demo logins (fictional data)")}</b><div class="chips">${(window.__portalTab ? [["member", "member123"]] : chips).map(([u, p]) => `<button class="chip-btn" data-act="demo-fill" data-u="${u}" data-p="${p}">${u}</button>`).join("")}</div></div>` : ""}
      <p class="hint">${BUILD_MODE === "offline" ? t("Offline edition: data is kept in this browser on this computer.") : t("Server edition")} · v${APP_VERSION}</p>
      <p class="powered">${t("Powered by Immora")}</p>
    </section></div>`;
}
FORMS.login = async (d, form) => {
  const err = $("#login-err"); err.textContent = ""; $("#login-btn").disabled = true;
  try { ME = await Backend.login(d.username, d.password, !!window.__portalTab); if (ME.lang) setLang(ME.lang); await start(); }
  catch (e) { err.textContent = e.message; $("#login-btn").disabled = false; }
};
ACT["login-tab"] = el => { window.__portalTab = el.dataset.portal === "1"; renderLogin(); };
ACT["demo-fill"] = el => { $("#login-user").value = el.dataset.u; $("#login-pass").value = el.dataset.p; $("#login-btn").focus(); };
ACT.logout = async () => { await Backend.logout().catch(() => {}); ME = null; location.hash = ""; renderLogin(); };
ACT.theme = () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("immora-bcs-theme", d.dataset.theme); } catch (e) { /* ignore */ } if (ME) render(); else renderLogin(); };
const langSelect = () => `<label class="lang-sel" title="${t("Language")}">${ic("globe")}<select data-live="lang" aria-label="${t("Language")}">${LANGS.map(([c, n]) => `<option value="${c}" ${c === LANG ? "selected" : ""}>${n}</option>`).join("")}</select></label>`;
LIVE.lang = el => { setLang(el.value, true); if (ME) render(); else renderLogin(); };

async function start() {
  try { loadState(await Backend.state()); } catch (e) { return renderLogin(e.message); }
  if (!location.hash || (ME.role === "member") !== curRoute().name.startsWith("p-")) location.hash = ME.role === "member" ? "#/p-home" : "#/dashboard";
  render();
  if (!localStorage.getItem("immora-bcs-tour-" + ME.role)) setTimeout(() => startTour(), 450);
}

/* ---------------------------------------------------------------- layout & router */
function sidebar() {
  const r = curRoute().name, closed = JSON.parse(localStorage.getItem("immora-bcs-nav") || "{}");
  let nav;
  if (ME.role === "member") nav = `<div class="nav-group"><div class="nav-items">${PORTAL_NAV.map(([k, l, i]) => `<a href="#/${k}" class="nav-item ${r === k ? "on" : ""}" id="nav-${k}">${ic(i)}<span>${t(l)}</span></a>`).join("")}</div></div>`;
  else nav = NAV.map(g => {
    const items = g.items.filter(([k]) => routeOK(k)); if (!items.length) return "";
    const has = items.some(([k]) => k === r || (k === "invoices" && r === "invoice") || (k === "contracts" && r === "contract") || (k === "members" && r === "member") || (k === "companies" && r === "company"));
    const isClosed = closed[g.id] && !has;
    return `<div class="nav-group ${isClosed ? "closed" : ""}"><button class="nav-head" data-act="nav-toggle" data-g="${g.id}" aria-expanded="${!isClosed}">${ic(g.icon)}<span>${t(g.label)}</span>${ic("chev", "chev")}</button>
      <div class="nav-items">${items.map(([k, l, i]) => `<a href="#/${k}" class="nav-item ${r === k ? "on" : ""}" id="nav-${k}">${ic(i)}<span>${t(l)}</span></a>`).join("")}</div></div>`;
  }).join("");
  const c = cfg();
  return `<aside class="sidebar" id="sidebar"><div class="side-brand"><img src="${IMMORA_LOGO.mark}" alt="" class="side-mark"><div><b>Immora BCS</b><small>${h(c.tradeName || c.legalName || "")}</small></div></div>
    <nav class="nav" aria-label="${t("Main menu")}">${nav}</nav><div class="side-foot">${t("Powered by Immora")}</div></aside>`;
}
ACT["nav-toggle"] = el => { const g = el.dataset.g, s = JSON.parse(localStorage.getItem("immora-bcs-nav") || "{}"); s[g] = !s[g]; localStorage.setItem("immora-bcs-nav", JSON.stringify(s)); el.parentElement.classList.toggle("closed", s[g]); el.setAttribute("aria-expanded", !s[g]); };
function topbar(title) {
  const quick = ME.role === "member" ? [["p-book", "Book a room"], ["p-ticket-new", "Raise a request"], ["p-guest-new", "Invite a guest"]] : QUICK.filter(q => !q[2] || q[2]()).map(q => [q[0], q[1]]);
  return `<header class="topbar"><button class="btn-icon only-mobile" data-act="menu" aria-label="${t("Menu")}" id="btn-menu">${ic("menu")}</button>
    <h1 class="page-title">${h(t(title || ""))}</h1>
    <button class="search-btn" data-act="palette" id="btn-search">${ic("search")}<span>${t("Search or jump to…")}</span><kbd>Ctrl K</kbd></button>
    <div class="top-actions"><div class="dd"><button class="btn btn-primary btn-sm" data-act="dd" id="btn-new">${ic("plus")}<span class="hide-sm">${t("New")}</span></button>
      <div class="dd-menu">${quick.map(([k, l]) => `<button data-act="quick" data-k="${k}">${t(l)}</button>`).join("")}</div></div>
      <span class="top-lang">${langSelect()}</span><button class="btn-icon" data-act="theme" id="btn-theme" title="${t("Light / dark")}" aria-label="${t("Light / dark")}">${ic(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button>
      <div class="dd"><button class="user-chip" data-act="dd" id="btn-user"><span class="avatar">${h((ME.name || ME.username).slice(0, 1))}</span><span class="hide-sm">${h(ME.name || ME.username)}<small>${L(ME.role)}</small></span></button>
      <div class="dd-menu right"><div class="dd-lang">${langSelect()}</div><button data-act="tour">${t("Take the guided tour")}</button><button data-act="shortcuts">${t("Keyboard shortcuts")}</button><button data-act="password">${t("Change password")}</button>${BUILD_MODE === "offline" && ME.role === "admin" ? `<button data-act="reset-demo">${t("Reset demo data")}</button>` : ""}<button data-act="logout" id="btn-logout">${ic("logout")} ${t("Sign out")}</button></div></div></div></header>`;
}
const QUICK = [["booking", "Room booking", () => can("bookings")], ["member", "Member", () => can("members")], ["lead", "Lead", () => can("leads")], ["visitor", "Visitor", () => can("visitors")],
  ["mailitem", "Mail item", () => can("mail")], ["ticket", "Ticket", () => can("tickets")], ["contract", "Contract", () => can("contracts")], ["invoice", "Invoice", () => can("invoices")], ["charge", "Charge (printing, coffee…)", () => can("charges")]];
ACT.quick = el => { closeDD(); const k = el.dataset.k; const f = { booking: () => bookingModal({}), member: () => memberModal(), lead: () => leadModal(), visitor: () => visitorModal(), mailitem: () => mailModal(), ticket: () => ticketModal(), contract: () => go("contract/new"), invoice: () => go("invoice/new"), charge: () => chargeModal(), "p-book": () => go("p-book"), "p-ticket-new": () => portalTicketModal(), "p-guest-new": () => portalGuestModal() }[k]; if (f) f(); };
ACT.dd = (el, ev) => { ev.stopPropagation(); const m = el.nextElementSibling; const open = m.classList.contains("open"); closeDD(); if (!open) m.classList.add("open"); };
function closeDD() { $$(".dd-menu.open").forEach(m => m.classList.remove("open")); }
ACT.menu = () => document.body.classList.toggle("nav-open");

let renderQueued = false;
function render() {
  if (!ME) return renderLogin();
  const { name, arg } = curRoute();
  document.body.className = "is-app" + (ME.role === "member" ? " is-portal" : "");
  let page = PAGES[name], title = ROUTE_TITLE[name] || "";
  if (!page || (ME.role === "member") !== name.startsWith("p-") || (isStaff() && !routeOK(name))) { page = ME.role === "member" ? PAGES["p-home"] : PAGES.dashboard; title = ME.role === "member" ? "Home" : "Dashboard"; }
  let body;
  try { const out = page(arg); if (out && typeof out === "object") { body = out.html; title = out.title || title; } else body = out; }
  catch (e) { console.error(e); body = `<div class="card"><h3>${t("Something went wrong on this screen")}</h3><p class="hint">${h(e.message)}</p></div>`; }
  const scroll = $("#view") ? $("#view").scrollTop : 0, same = window.__lastRoute === location.hash;
  $("#app").innerHTML = `<div class="shell">${sidebar()}<div class="main">${topbar(title)}<main id="view" class="view" tabindex="-1">${body}</main></div><div class="scrim" data-act="menu"></div></div>`;
  document.title = `${t(title)} · Immora BCS`;
  if (same) $("#view").scrollTop = scroll; window.__lastRoute = location.hash;
  document.body.classList.remove("nav-open");
  const a = AFTER[name]; if (a) try { a(arg); } catch (e) { console.error(e); }
}
window.addEventListener("hashchange", () => { if (ME) render(); });

/* ---------------------------------------------------------------- building blocks */
const pageHead = (title, sub, actions) => `<div class="page-head"><div><h2>${h(title)}</h2>${sub ? `<p class="sub">${sub}</p>` : ""}</div><div class="actions">${actions || ""}</div></div>`;
const btn = (label, a, data, cls, id) => `<button class="btn ${cls || "btn-ghost"}" data-act="${a}" ${Object.entries(data || {}).map(([k, v]) => `data-${k}="${h(v)}"`).join(" ")} ${id ? `id="${id}"` : ""}>${label}</button>`;
const link = (label, route) => `<a href="#/${route}">${h(label)}</a>`;
const chip = (s, tone) => `<span class="chip ${tone || "c-" + String(s).replace(/[^a-z_]/g, "")}">${h(L(s))}</span>`;
const kpi = (label, value, sub, icon, tone, extra) => `<div class="kpi ${tone || ""}"><div class="kpi-ic">${ic(icon || "chart")}</div><div><div class="kpi-l">${h(label)}</div><div class="kpi-v">${value}</div>${sub ? `<div class="kpi-s">${sub}</div>` : ""}</div>${extra || ""}</div>`;
const empty = (msg, action) => `<div class="empty">${ic("file")}<p>${h(msg)}</p>${action || ""}</div>`;
function table(cols, rows, o) {
  o = o || {};
  if (!rows.length) return empty(o.empty || t("Nothing here yet."), o.emptyAction);
  return `<div class="table-wrap"><table class="tbl ${o.cls || ""}" ${o.id ? `id="${o.id}"` : ""}><thead><tr>${cols.map(c => `<th class="${c.cls || ""}">${h(t(c.label))}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr ${o.rowAttr ? o.rowAttr(r) : ""}>${cols.map(c => `<td data-label="${h(t(c.label))}" class="${c.cls || ""}">${c.f ? c.f(r) : h(r[c.k])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
const filterBox = (target, ph) => `<div class="filter"><span>${ic("search")}</span><input type="search" data-live="filter" data-target="${target}" placeholder="${h(ph || t("Filter this list…"))}" aria-label="${t("Filter")}"></div>`;
LIVE.filter = el => { const q = el.value.trim().toLowerCase(), tb = document.getElementById(el.dataset.target); if (!tb) return; $$("tbody tr", tb).forEach(tr => tr.hidden = q && !tr.textContent.toLowerCase().includes(q)); };
function fld(label, input, o) { o = o || {}; return `<label class="fld ${o.wide ? "wide" : ""} ${o.cls || ""}"><span class="fl">${h(label)}${o.req ? ' <i class="req">*</i>' : ""}</span>${input}${o.hint ? `<small class="hint">${o.hint}</small>` : ""}<small class="ferr"></small></label>`; }
const inp = (n, v, a) => `<input name="${n}" value="${h(v === undefined || v === null ? "" : v)}" ${a || ""}>`;
const numInp = (n, v, a) => `<input name="${n}" data-type="num" inputmode="decimal" value="${h(v === undefined || v === null ? "" : v)}" ${a || ""}>`;
const dateInp = (n, v, a) => `<input name="${n}" data-type="date" placeholder="DD-MM-YYYY" inputmode="numeric" maxlength="10" value="${h(fmtD(v))}" ${a || ""}>`;
const selInp = (n, list, v, blank, a) => `<select name="${n}" ${a || ""}>${opts(list, v, blank)}</select>`;
const txt = (n, v, a) => `<textarea name="${n}" rows="3" ${a || ""}>${h(v || "")}</textarea>`;
function fieldError(form, field, msg) {
  const el = form && form.querySelector(`[name="${field}"]`); if (!el) return;
  const f = el.closest(".fld"); if (f) { f.classList.add("bad"); const e = $(".ferr", f); if (e) e.textContent = msg; }
  el.focus();
}
function formData(form) {
  const d = {}; let bad = false;
  $$(".fld.bad", form).forEach(f => { f.classList.remove("bad"); const e = $(".ferr", f); if (e) e.textContent = ""; });
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    let v = el.type === "checkbox" ? el.checked : el.value;
    if (el.type === "radio" && !el.checked) continue;
    if (el.multiple) v = Array.from(el.selectedOptions).map(o => o.value);
    if (el.dataset.type === "date" && typeof v === "string") { const p = parseD(v); if (p === null) { fieldError(form, el.name, t("Use DD-MM-YYYY")); bad = true; continue; } v = p; }
    if (el.dataset.type === "num" && typeof v === "string") { v = v.replace(/,/g, "").trim(); if (v !== "" && !isFinite(Number(v))) { fieldError(form, el.name, t("Enter a number")); bad = true; continue; } v = v === "" ? "" : Number(v); }
    if (el.required && (v === "" || v === false)) { fieldError(form, el.name, t("Required")); bad = true; continue; }
    if (el.name.endsWith("[]")) { const k = el.name.slice(0, -2); (d[k] = d[k] || []).push(v); } else d[el.name] = v;
  }
  if (bad) throw new Error("invalid");
  return d;
}
/* type-as-you-go date mask + inline check on blur */
document.addEventListener("input", ev => {
  const el = ev.target;
  if (el.dataset && el.dataset.type === "date" && ev.inputType && ev.inputType.startsWith("insert")) { let v = el.value.replace(/[^\d]/g, "").slice(0, 8); if (v.length > 4) v = v.slice(0, 2) + "-" + v.slice(2, 4) + "-" + v.slice(4); else if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2); el.value = v; }
  if (el.dataset && el.dataset.live && LIVE[el.dataset.live] && el.tagName !== "SELECT") LIVE[el.dataset.live](el, ev);
});
document.addEventListener("change", ev => { const el = ev.target; if (el.dataset && el.dataset.live && LIVE[el.dataset.live] && (el.tagName === "SELECT" || el.type === "checkbox")) LIVE[el.dataset.live](el, ev); });
document.addEventListener("focusout", ev => {
  const el = ev.target; if (!el.closest || !el.closest(".fld")) return; const f = el.closest(".fld"), e = $(".ferr", f);
  let msg = "";
  if (el.dataset.type === "date" && el.value && parseD(el.value) === null) msg = t("Use DD-MM-YYYY");
  else if (el.required && !el.value && el.dataset.touched) msg = t("Required");
  else if (el.type === "email" && el.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) msg = t("Enter a valid email address");
  el.dataset.touched = "1"; f.classList.toggle("bad", !!msg); if (e) e.textContent = msg;
});
document.addEventListener("submit", async ev => {
  const form = ev.target; const name = form.dataset.form; if (!name || !FORMS[name]) return;
  ev.preventDefault(); let d; try { d = formData(form); } catch (e) { toast(t("Please fix the highlighted fields"), "err"); return; }
  const b = form.querySelector("button[type=submit],button:not([type])"); if (b) b.disabled = true;
  try { await FORMS[name](d, form, ev); } finally { if (b && document.body.contains(b)) b.disabled = false; }
});
document.addEventListener("click", ev => {
  const a = ev.target.closest("[data-act]");
  if (!ev.target.closest(".dd-lang") && (!a || !a.closest(".dd"))) closeDD();
  if (a && ACT[a.dataset.act]) { if (a.tagName === "A" || a.tagName === "BUTTON") ev.preventDefault(); ACT[a.dataset.act](a, ev); return; }
  const g = ev.target.closest("[data-go]"); if (g && !ev.target.closest("a,button,input,select")) go(g.dataset.go);
});

/* ---------------------------------------------------------------- modal */
function modal(title, body, o) {
  o = o || {}; closeModal(true);
  const m = document.createElement("div"); m.className = "modal-bg"; m.id = "modal";
  m.innerHTML = `<div class="modal ${o.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h3 id="modal-title">${h(title)}</h3><button class="btn-icon" data-act="close-modal" aria-label="${t("Close")}">${ic("x")}</button></div><div class="modal-body">${body}</div></div>`;
  document.body.appendChild(m); window.__modalFocus = document.activeElement;
  setTimeout(() => { const f = m.querySelector("input:not([type=hidden]):not([readonly]),select,textarea,button.btn-primary"); if (f) f.focus(); }, 30);
  m.addEventListener("mousedown", ev => { if (ev.target === m) closeModal(); });
  return m;
}
function closeModal(quiet) { const m = $("#modal"); if (m) m.remove(); if (!quiet && window.__modalFocus && document.body.contains(window.__modalFocus)) try { window.__modalFocus.focus(); } catch (e) { /* ignore */ } }
ACT["close-modal"] = () => closeModal();
function confirmBox(msg, okLabel, danger) {
  return new Promise(res => {
    const m = modal(t("Please confirm"), `<p>${h(msg)}</p><div class="form-foot"><button class="btn btn-ghost" id="cf-no">${t("Cancel")}</button><button class="btn ${danger ? "btn-danger" : "btn-primary"}" id="cf-yes">${h(okLabel || t("OK"))}</button></div>`);
    $("#cf-yes", m).onclick = () => { closeModal(); res(true); }; $("#cf-no", m).onclick = () => { closeModal(); res(false); };
  });
}
function promptBox(title, label, val) {
  return new Promise(res => {
    const m = modal(title, `<form id="pb-form" class="grid-form">${fld(label, `<input name="v" id="pb-v" value="${h(val || "")}" required>`, { wide: true })}<div class="form-foot wide"><button type="button" class="btn btn-ghost" id="pb-no">${t("Cancel")}</button><button class="btn btn-primary" id="pb-ok">${t("OK")}</button></div></form>`);
    $("#pb-form", m).onsubmit = ev => { ev.preventDefault(); const v = $("#pb-v").value.trim(); if (!v) return fieldError($("#pb-form"), "v", t("Required")); closeModal(); res(v); };
    $("#pb-no", m).onclick = () => { closeModal(); res(null); };
  });
}

/* ---------------------------------------------------------------- command palette (Ctrl+K) */
function paletteItems() {
  const items = [];
  if (ME.role === "member") PORTAL_NAV.forEach(([k, l]) => items.push({ label: t(l), hint: t("Page"), run: () => go(k) }));
  else {
    NAV.forEach(g => g.items.forEach(([k, l]) => { if (routeOK(k)) items.push({ label: t(l), hint: t(g.label), run: () => go(k) }); }));
    QUICK.forEach(q => { if (!q[2] || q[2]()) items.push({ label: t("New") + ": " + t(q[1]), hint: t("Action"), run: () => ACT.quick({ dataset: { k: q[0] } }) }); });
    if (canAct("billing_run")) items.push({ label: t("Run billing for this month"), hint: t("Action"), run: () => go("billingrun") });
    if (canAct("card_tap")) items.push({ label: t("Simulate an access-card tap"), hint: t("Action"), run: () => cardTapModal() });
    DB.members.forEach(m => items.push({ label: m.name, hint: t("Member") + (m.companyId ? " · " + ((byId("companies", m.companyId) || {}).legalName || "") : ""), run: () => go("member/" + m.id) }));
    DB.companies.forEach(c => items.push({ label: c.legalName, hint: t("Company"), run: () => go("company/" + c.id) }));
    DB.spaces.forEach(s => items.push({ label: `${s.code} · ${s.name}`, hint: L(s.type), run: () => spaceModal(s.id) }));
    DB.invoices.filter(i => i.number).forEach(i => items.push({ label: `${i.number} · ${(i.customer || {}).name || ""}`, hint: t("Invoice") + " · " + money(i.total), run: () => go("invoice/" + i.id) }));
    DB.contracts.forEach(c => items.push({ label: `${c.number} · ${partyName(c)}`, hint: t("Contract"), run: () => go("contract/" + c.id) }));
    DB.leads.forEach(l => items.push({ label: `${l.name}${l.company ? " · " + l.company : ""}`, hint: t("Lead") + " · " + L(l.stage), run: () => leadModal(l.id) }));
  }
  items.push({ label: t("Switch light / dark"), hint: t("Action"), run: () => ACT.theme() });
  items.push({ label: t("Take the guided tour"), hint: t("Help"), run: () => startTour() });
  return items;
}
ACT.palette = () => {
  const m = modal(t("Search or jump to…"), `<input id="pal-q" class="pal-q" placeholder="${t("Type a page, member, company, invoice, space…")}" autocomplete="off"><div id="pal-list" class="pal-list" role="listbox"></div><p class="hint">↑ ↓ ${t("to move")} · Enter ${t("to open")} · Esc ${t("to close")}</p>`);
  m.classList.add("palette");
  const all = paletteItems(); let sel = 0, shown = [];
  const draw = () => {
    const q = $("#pal-q").value.trim().toLowerCase(); const words = q.split(/\s+/).filter(Boolean);
    shown = all.filter(i => words.every(w => (i.label + " " + i.hint).toLowerCase().includes(w))).slice(0, 40); sel = Math.min(sel, Math.max(0, shown.length - 1));
    $("#pal-list").innerHTML = shown.length ? shown.map((i, n) => `<button class="pal-item ${n === sel ? "on" : ""}" data-n="${n}" role="option"><span>${h(i.label)}</span><small>${h(i.hint)}</small></button>`).join("") : `<p class="hint">${t("No matches")}</p>`;
  };
  draw();
  $("#pal-q").addEventListener("input", () => { sel = 0; draw(); });
  $("#pal-q").addEventListener("keydown", ev => {
    if (ev.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); draw(); ev.preventDefault(); }
    else if (ev.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); ev.preventDefault(); }
    else if (ev.key === "Enter" && shown[sel]) { ev.preventDefault(); const it = shown[sel]; closeModal(true); it.run(); }
  });
  $("#pal-list").addEventListener("click", ev => { const b = ev.target.closest(".pal-item"); if (b) { const it = shown[Number(b.dataset.n)]; closeModal(true); it.run(); } });
};
document.addEventListener("keydown", ev => {
  if (!ME) return;
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === "k" || ev.key === "K")) { ev.preventDefault(); ACT.palette(); return; }
  if (ev.key === "Escape") { if ($("#tour")) endTour(); else closeModal(); closeDD(); return; }
  const typing = /INPUT|SELECT|TEXTAREA/.test((ev.target.tagName || "")) || ev.target.isContentEditable;
  if (!typing && ev.key === "?" && !$("#modal")) ACT.shortcuts();
  if (!typing && ev.key === "/" && !$("#modal")) { ev.preventDefault(); ACT.palette(); }
});
ACT.shortcuts = () => modal(t("Keyboard shortcuts"), `<table class="tbl"><tbody>
  <tr><td><kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>/</kbd></td><td>${t("Search or jump to any page, member, invoice or space")}</td></tr>
  <tr><td><kbd>Esc</kbd></td><td>${t("Close a window")}</td></tr><tr><td><kbd>?</kbd></td><td>${t("Show this help")}</td></tr>
  <tr><td><kbd>Enter</kbd></td><td>${t("Save the open form")}</td></tr></tbody></table>`);
ACT.password = () => {
  modal(t("Change password"), `<form data-form="password" class="grid-form">${fld(t("Current password"), `<input type="password" name="old" required autocomplete="current-password">`, { wide: true })}${fld(t("New password"), `<input type="password" name="new" required minlength="8" autocomplete="new-password">`, { wide: true, hint: t("At least 8 characters") })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`);
};
FORMS.password = async (d, form) => { try { await Backend.password(d.old, d.new); closeModal(); toast(t("Password changed")); } catch (e) { fail(e, form); } };
ACT["reset-demo"] = async () => { if (await confirmBox(t("Replace all data in this browser with the fictional demo data?"), t("Reset"), true)) { await LocalBackend.resetDemo(); await refresh(); toast(t("Demo data restored")); } };

/* ---------------------------------------------------------------- guided tour */
const TOURS = {
  common: [["#sidebar", "Menu", "Everything is grouped here. Click a heading to open or close its group."], ["#btn-search", "Search anything", "Press Ctrl + K to jump to a page, member, company, invoice or space."], ["#btn-new", "One-click create", "Create a booking, member, visitor, mail item or invoice from any screen."], ["#btn-theme", "Light or dark", "Switch the look any time. Your language choice is next to it."]],
  admin: [["#home-actions", "Your home screen", "Today's key numbers and one-click actions for the centre manager."]],
  frontdesk: [["#home-actions", "Front desk home", "Check in visitors and members, log mail and calls, and see today's rooms."]],
  community: [["#home-actions", "Community home", "Your pipeline, tours and renewals due, with one-click actions."]],
  finance: [["#home-actions", "Finance home", "Draft invoices, overdue balances, billing run and reminders."]],
  viewer: [["#home-actions", "Read-only home", "You can see everything but not change it."]],
  member: [["#portal-actions", "Welcome to your member portal", "Book rooms with your credits, see invoices, raise requests and invite guests."]],
};
let tourStep = 0, TOUR_STEPS = [];
function startTour() {
  if (!ME) return; closeModal(true);
  TOUR_STEPS = (ME.role === "member" ? [] : TOURS.common).concat(TOURS[ME.role] || []).filter(s => $(s[0]) && $(s[0]).getBoundingClientRect().width > 0);
  if (window.innerWidth < 900) TOUR_STEPS = TOUR_STEPS.filter(s => s[0] !== "#sidebar");
  tourStep = 0; drawTour();
}
function drawTour() {
  let o = $("#tour"); if (o) o.remove();
  if (tourStep >= TOUR_STEPS.length) return endTour();
  const [sel, title, text] = TOUR_STEPS[tourStep], el = $(sel); if (!el) { tourStep++; return drawTour(); }
  el.scrollIntoView({ block: "nearest" }); const r = el.getBoundingClientRect();
  o = document.createElement("div"); o.id = "tour"; o.className = "tour";
  const top = Math.min(window.innerHeight - 190, r.bottom + 12), left = Math.max(12, Math.min(window.innerWidth - 332, r.left));
  o.innerHTML = `<div class="tour-hole" style="top:${r.top - 6}px;left:${r.left - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>
    <div class="tour-box" role="dialog" aria-label="${t("Guided tour")}" style="top:${r.bottom + 190 > window.innerHeight ? Math.max(12, r.top - 180) : top}px;left:${left}px"><small>${tourStep + 1} / ${TOUR_STEPS.length}</small><h4>${t(title)}</h4><p>${t(text)}</p>
    <div class="tour-foot"><button class="btn btn-ghost btn-sm" data-act="tour-end">${t("Skip")}</button><button class="btn btn-primary btn-sm" data-act="tour-next" id="tour-next">${tourStep + 1 < TOUR_STEPS.length ? t("Next") : t("Done")}</button></div></div>`;
  document.body.appendChild(o);
}
function endTour() { const o = $("#tour"); if (o) o.remove(); if (ME) localStorage.setItem("immora-bcs-tour-" + ME.role, "1"); }
ACT.tour = () => startTour(); ACT["tour-next"] = () => { tourStep++; drawTour(); }; ACT["tour-end"] = () => endTour();

/* names */
const partyName = r => r.companyId ? ((byId("companies", r.companyId) || {}).legalName || "—") : r.memberId ? ((byId("members", r.memberId) || {}).name || "—") : (r.customerName || "—");
const memberName = id => (byId("members", id) || {}).name || "—";
const spaceName = id => { const s = byId("spaces", id); return s ? `${s.code} · ${s.name}` : "—"; };
const partyOptions = (sel) => `<optgroup label="${t("Companies")}">${DB.companies.filter(c => c.status !== "ended").map(c => `<option value="c:${c.id}" ${sel === "c:" + c.id ? "selected" : ""}>${h(c.legalName)}</option>`).join("")}</optgroup><optgroup label="${t("Members (individuals)")}">${DB.members.filter(m => !m.companyId).map(m => `<option value="m:${m.id}" ${sel === "m:" + m.id ? "selected" : ""}>${h(m.name)}</option>`).join("")}</optgroup>`;
const partyKeyOf = r => r.companyId ? "c:" + r.companyId : r.memberId ? "m:" + r.memberId : "";
const splitParty = v => ({ companyId: v && v.startsWith("c:") ? v.slice(2) : "", memberId: v && v.startsWith("m:") ? v.slice(2) : "" });
const memberOpts = (sel, blank) => opts(DB.members.filter(m => m.status === "active" || m.id === sel).map(m => [m.id, m.name + (m.companyId ? " · " + ((byId("companies", m.companyId) || {}).legalName || "") : "")]), sel, blank === undefined ? t("— choose —") : blank);

/* ===== 11-charts.js ===== */
/* Tiny SVG charts (no libraries). */
function barChart(data, o) {
  o = o || {}; const W = o.w || 560, H = o.h || 220, pl = 54, pb = 34, pt = 14, max = Math.max(1, ...data.map(d => d.value)) * 1.1;
  const bw = (W - pl - 10) / Math.max(1, data.length), y = v => pt + (H - pt - pb) * (1 - v / max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => max / 1.1 * f);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(o.label || "")}">
    ${ticks.map(v => `<line x1="${pl}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${pl - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`).join("")}
    ${data.map((d, i) => `<g><rect x="${pl + i * bw + bw * 0.18}" y="${y(d.value)}" width="${bw * 0.64}" height="${Math.max(0, H - pb - y(d.value))}" rx="5" class="bar ${d.cls || ""}"><title>${h(d.label)}: ${h(o.fmt ? o.fmt(d.value) : d.value)}</title></rect>
      <text x="${pl + i * bw + bw / 2}" y="${H - pb + 16}" class="ax" text-anchor="middle">${h(d.label)}</text></g>`).join("")}</svg>`;
}
function stackChart(data, keys, o) {
  o = o || {}; const W = o.w || 560, H = o.h || 220, pl = 54, pb = 34, pt = 14, max = Math.max(1, ...data.map(d => keys.reduce((a, k) => a + Math.max(0, d[k[0]] || 0), 0))) * 1.1;
  const bw = (W - pl - 10) / Math.max(1, data.length), sc = v => (H - pt - pb) * v / max;
  const ticks = [0, 0.5, 1].map(f => max / 1.1 * f);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(o.label || "")}">${ticks.map(v => `<line x1="${pl}" x2="${W - 6}" y1="${H - pb - sc(v)}" y2="${H - pb - sc(v)}" class="grid"/><text x="${pl - 6}" y="${H - pb - sc(v) + 4}" class="ax" text-anchor="end">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`).join("")}
    ${data.map((d, i) => { let acc = 0; return keys.map(([k, , cls]) => { const v = Math.max(0, d[k] || 0), y0 = H - pb - sc(acc + v); acc += v; return `<rect x="${pl + i * bw + bw * 0.18}" y="${y0}" width="${bw * 0.64}" height="${sc(v)}" class="bar ${cls}"><title>${h(d.label)}: ${h(o.fmt ? o.fmt(v) : v)}</title></rect>`; }).join("") + `<text x="${pl + i * bw + bw / 2}" y="${H - pb + 16}" class="ax" text-anchor="middle">${h(d.label)}</text>`; }).join("")}</svg>
    <div class="legend">${keys.map(([, l, cls]) => `<span><i class="sw ${cls}"></i>${h(l)}</span>`).join("")}</div>`;
}
function donut(parts, o) {
  o = o || {}; const total = parts.reduce((a, p) => a + p.value, 0) || 1, R0 = 52, C = 2 * Math.PI * R0; let off = 0;
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 140 140" role="img" aria-label="${h(o.label || "")}"><circle cx="70" cy="70" r="${R0}" class="donut-bg"/>
    ${parts.map(p => { const len = C * p.value / total, s = `<circle cx="70" cy="70" r="${R0}" class="dseg ${p.cls}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}"><title>${h(p.label)}: ${p.value}</title></circle>`; off += len; return s; }).join("")}
    <text x="70" y="68" text-anchor="middle" class="donut-v">${h(o.center || "")}</text><text x="70" y="86" text-anchor="middle" class="donut-l">${h(o.sub || "")}</text></svg>
    <div class="legend col">${parts.map(p => `<span><i class="sw ${p.cls}"></i>${h(p.label)} <b>${h(o.fmt ? o.fmt(p.value) : p.value)}</b></span>`).join("")}</div></div>`;
}
function spark(vals, cls) {
  if (!vals.length) return ""; const W = 90, H = 30, max = Math.max(...vals, 1), min = Math.min(...vals, 0);
  const pts = vals.map((v, i) => `${(i / Math.max(1, vals.length - 1)) * W},${H - 3 - (H - 6) * (v - min) / Math.max(1e-9, max - min)}`).join(" ");
  return `<svg class="spark ${cls || ""}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts}"/></svg>`;
}
const meter = (p, cls) => `<div class="meter ${cls || ""}"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></div>`;

/* ===== 20-home.js ===== */
/* Role home screens + shared calculations. */
function contractCovers(c, day) { return ["active", "notice"].includes(c.status) && c.start <= day && c.end >= day; }
function spaceState(s, day) {
  day = day || TODAY;
  if (s.status === "maintenance") return "maintenance";
  if (["meeting_room", "event_space"].includes(s.type)) return DB.bookings.some(b => b.spaceId === s.id && b.status !== "cancelled" && b.start <= `${TODAY}T${NOW}` && b.end > `${TODAY}T${NOW}`) ? "occupied" : "available";
  if (s.type === "virtual_office") return "available";
  const c = DB.contracts.find(c => (c.spaceIds || []).includes(s.id) && contractCovers(c, day));
  if (c) return "occupied";
  if (s.status === "reserved" || DB.contracts.some(c => (c.spaceIds || []).includes(s.id) && c.status === "draft")) return "reserved";
  return "available";
}
function holderOf(s) { const c = DB.contracts.find(c => (c.spaceIds || []).includes(s.id) && contractCovers(c, TODAY)); return c ? { contract: c, name: partyName(c) } : null; }
function occupancy(types) {
  const list = DB.spaces.filter(s => types.includes(s.type));
  const occ = list.filter(s => spaceState(s) === "occupied").length, maint = list.filter(s => s.status === "maintenance").length;
  return { total: list.length, occ, maint, pct: list.length ? 100 * occ / Math.max(1, list.length - maint) : 0 };
}
const monthlyValue = c => Number(c.monthlyFee || 0) + sum(c.addons || [], a => Number(a.qty || 0) * Number(a.price || 0));
const mrr = () => sum(DB.contracts.filter(c => contractCovers(c, TODAY)), monthlyValue);
const openInvoices = () => DB.invoices.filter(i => ["issued", "part_paid"].includes(i.status));
const invBal = i => R.balance(i, DB);
const overdue = () => openInvoices().filter(i => i.dueDate < TODAY && invBal(i) > 0);
const todaysBookings = () => DB.bookings.filter(b => b.start.slice(0, 10) === TODAY && b.status !== "cancelled").sort((a, b) => a.start < b.start ? -1 : 1);
function noticeList() { return DB.contracts.filter(c => R.noticeDue(c, TODAY)[1]).sort((a, b) => a.end < b.end ? -1 : 1); }
function revenueByMonth(n) {
  const out = []; for (let k = n - 1; k >= 0; k--) { const ms = R.addMonths(R.monthBounds(TODAY)[0], -k), [a, b] = R.monthBounds(ms);
    const inv = DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= a && i.date <= b), cn = DB.creditnotes.filter(c => c.date >= a && c.date <= b);
    out.push({ label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, month: ms, value: R.r2(sum(inv, i => i.subtotal) - sum(cn, c => c.subtotal)), vat: R.r2(sum(inv, i => i.vatTotal) - sum(cn, c => c.vatTotal)) }); }
  return out;
}

PAGES.dashboard = () => {
  const r = ME.role, c = cfg();
  const occO = occupancy(["private_office"]), occD = occupancy(["dedicated_desk"]), od = overdue(), rev = revenueByMonth(6);
  const tb = todaysBookings(), vis = DB.visitors.filter(v => v.date === TODAY && v.status !== "cancelled"), mailNew = DB.mail.filter(m => m.status === "received");
  const tickets = DB.tickets.filter(x => ["open", "in_progress", "waiting"].includes(x.status)), notices = noticeList();
  const drafts = DB.invoices.filter(i => i.status === "draft");
  const hello = `${t("Good day")}, ${h((ME.name || "").split(" ")[0])}`;
  const actions = {
    admin: [["booking", "New booking", "cal"], ["member", "Add member", "users"], ["go:billingrun", "Run billing", "refresh"], ["go:contract/new", "New contract", "file"], ["go:floorplan", "Floor plan", "map"], ["go:reports", "Reports", "chart"]],
    frontdesk: [["visitor", "Register visitor", "qr"], ["go:checkin", "Member check-in", "check"], ["mailitem", "Log mail", "mail"], ["call", "Log a call", "phone"], ["cardtap", "Card tap (simulated)", "card"], ["ticket", "New ticket", "ticket"]],
    community: [["lead", "New lead", "funnel"], ["tour", "Book a tour", "door"], ["go:quote/new", "New quote", "file"], ["go:contract/new", "New contract", "file"], ["booking", "New booking", "cal"], ["go:renewals", "Renewals", "bell"]],
    finance: [["go:billingrun", "Run billing", "refresh"], ["dunning", "Send reminders", "alert"], ["receipt", "Record payment", "receipt"], ["go:invoice/new", "New invoice", "bill"], ["charge", "Add charge", "coffee"], ["go:books", "Export to Books", "download"]],
    viewer: [["go:reports", "Reports", "chart"], ["go:floorplan", "Floor plan", "map"], ["go:calendar", "Room calendar", "cal"], ["go:invoices", "Invoices", "bill"]],
  }[r] || [];
  const actHtml = `<div class="quick-grid" id="home-actions">${actions.map(([k, l, i]) => `<button class="quick" data-act="home-act" data-k="${k}">${ic(i)}<span>${t(l)}</span></button>`).join("")}</div>`;
  const k = [];
  if (r !== "frontdesk") k.push(kpi(t("Office occupancy"), pct(occO.pct), `${occO.occ}/${occO.total - occO.maint} ${t("offices")}`, "building", "blue", meter(occO.pct)));
  if (r === "frontdesk") k.push(kpi(t("Visitors today"), vis.length, `${vis.filter(v => v.status === "checked_in").length} ${t("in the building")}`, "qr", "blue"));
  k.push(kpi(t("Desk occupancy"), pct(occD.pct), `${occD.occ}/${occD.total} ${t("dedicated desks")}`, "grid", "teal", meter(occD.pct, "teal")));
  k.push(kpi(t("Room bookings today"), tb.length, `${sum(tb, b => R.hoursBetween(b.start, b.end)).toFixed(1)} ${t("hours booked")}`, "cal", "violet"));
  if (["admin", "finance", "viewer"].includes(r)) { k.push(kpi(t("Monthly recurring revenue"), money0(mrr()), t("active contracts, before VAT"), "chart", "green", spark(rev.map(x => x.value)))); k.push(kpi(t("Overdue"), money0(sum(od, invBal)), `${od.length} ${t("invoices")}`, "alert", od.length ? "red" : "green")); }
  if (r === "community") { k.push(kpi(t("Open leads"), DB.leads.filter(l => !["won", "lost"].includes(l.stage)).length, money0(sum(DB.leads.filter(l => !["won", "lost"].includes(l.stage)), l => l.budget)) + " " + t("/month potential"), "funnel", "green")); k.push(kpi(t("Renewals due"), notices.length, t("in the notice window"), "bell", notices.length ? "amber" : "green")); }
  if (r === "frontdesk") { k.push(kpi(t("Mail to hand out"), mailNew.length, t("received, not yet notified"), "mail", mailNew.length ? "amber" : "green")); k.push(kpi(t("Open tickets"), tickets.length, "", "ticket", "red")); }
  const bookingsCard = `<div class="card"><div class="card-head"><h3>${t("Today's rooms")}</h3>${link(t("Open calendar"), "calendar")}</div>${tb.length ? `<ul class="timeline">${tb.map(b => `<li><b>${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(spaceName(b.spaceId))}</span><small>${h(memberName(b.memberId))} · ${h(b.title || "")}</small></li>`).join("")}</ul>` : empty(t("No rooms booked today."))}</div>`;
  const alerts = [];
  notices.slice(0, 4).forEach(x => alerts.push(`<li>${ic("bell")}<span>${link(x.number, "contract/" + x.id)} ${h(partyName(x))} — ${t("ends")} ${fmtD(x.end)}, ${t("notice by")} ${fmtD(R.noticeDue(x, TODAY)[0])}</span></li>`));
  od.slice(0, 4).forEach(i => alerts.push(`<li class="bad">${ic("alert")}<span>${link(i.number, "invoice/" + i.id)} ${h((i.customer || {}).name)} — ${money(invBal(i))} ${t("overdue since")} ${fmtD(i.dueDate)}</span></li>`));
  if (drafts.length && ["admin", "finance"].includes(r)) alerts.push(`<li>${ic("bill")}<span>${drafts.length} ${t("draft invoices waiting to be issued")} — ${link(t("review"), "invoices")}</span></li>`);
  DB.companies.filter(x => x.licenceExpiry && x.licenceExpiry <= R.addDays(TODAY, 45)).slice(0, 3).forEach(x => alerts.push(`<li>${ic("file")}<span>${h(x.legalName)} — ${t("trade licence expires")} ${fmtD(x.licenceExpiry)}</span></li>`));
  const alertCard = `<div class="card"><div class="card-head"><h3>${t("Needs attention")}</h3></div>${alerts.length ? `<ul class="alerts">${alerts.join("")}</ul>` : empty(t("All clear."))}</div>`;
  let mid = "";
  if (r === "frontdesk") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Visitors today")}</h3>${link(t("All visitors"), "visitors")}</div>${visitorList(vis)}</div>${bookingsCard}</div>
     <div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Mail waiting")}</h3>${link(t("Mail log"), "mail")}</div>${table([{ label: "For", f: m => h(partyName(m)) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "", f: m => can("mail") ? btn(t("Notify"), "mail-status", { id: m.id, s: "notified" }, "btn-ghost btn-sm") : "" }], mailNew)}</div>
     <div class="card"><div class="card-head"><h3>${t("Open tickets")}</h3>${link(t("Helpdesk"), "tickets")}</div>${ticketMini(tickets)}</div></div>`;
  else if (r === "community") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Pipeline")}</h3>${link(t("Open pipeline"), "leads")}</div>${pipelineMini()}</div>
     <div class="card"><div class="card-head"><h3>${t("Upcoming tours")}</h3>${link(t("All tours"), "tours")}</div>${tourList(DB.tours.filter(x => x.status === "booked" && x.when.slice(0, 10) >= TODAY).sort((a, b) => a.when < b.when ? -1 : 1).slice(0, 6))}</div></div><div class="grid-2">${bookingsCard}${alertCard}</div>`;
  else if (r === "finance") mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Revenue (6 months, before VAT)")}</h3>${link(t("Reports"), "reports")}</div>${barChart(rev, { fmt: v => Math.round(v / 1000) + "k", label: t("Revenue") })}</div>
     <div class="card"><div class="card-head"><h3>${t("Aged receivables")}</h3>${link(t("Overdue & reminders"), "dunning")}</div>${agingCard()}</div></div>${alertCard}`;
  else mid = `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Revenue (6 months, before VAT)")}</h3>${link(t("Reports"), "reports")}</div>${barChart(rev, { fmt: v => Math.round(v / 1000) + "k", label: t("Revenue") })}</div>
     <div class="card"><div class="card-head"><h3>${t("Space status now")}</h3>${link(t("Floor plan"), "floorplan")}</div>${spaceDonut()}</div></div><div class="grid-2">${bookingsCard}${alertCard}</div>`;
  return { title: "Dashboard", html: `<div class="hero"><div><h2>${hello}</h2><p class="sub">${h(c.tradeName || c.legalName || "")} · ${fmtD(TODAY)} · ${L(ME.role)}${ME.role === "viewer" ? " · " + t("read-only") : ""}</p></div></div>${actHtml}<div class="kpis">${k.join("")}</div>${mid}` };
};
ACT["home-act"] = el => { const k = el.dataset.k; if (k.startsWith("go:")) return go(k.slice(3)); ({ booking: () => bookingModal({}), member: () => memberModal(), visitor: () => visitorModal(), mailitem: () => mailModal(), call: () => callModal(), cardtap: () => cardTapModal(), ticket: () => ticketModal(), lead: () => leadModal(), tour: () => tourModal(), dunning: () => go("dunning"), receipt: () => receiptModal(), charge: () => chargeModal() })[k](); };
function spaceDonut() {
  const st = { available: 0, occupied: 0, reserved: 0, maintenance: 0 };
  DB.spaces.filter(s => ["private_office", "dedicated_desk", "hot_desk", "meeting_room", "event_space"].includes(s.type)).forEach(s => st[spaceState(s)]++);
  return donut([{ label: L("occupied"), value: st.occupied, cls: "s-occ" }, { label: L("available"), value: st.available, cls: "s-av" }, { label: L("reserved"), value: st.reserved, cls: "s-res" }, { label: L("maintenance"), value: st.maintenance, cls: "s-mt" }], { center: String(st.occupied), sub: t("in use") });
}
function agingBuckets() {
  const b = [["Current", 0], ["1–30 days", 0], ["31–60 days", 0], ["61–90 days", 0], ["90+ days", 0]];
  for (const i of openInvoices()) { const bal = invBal(i); if (bal <= 0) continue; const d = R.daysBetween(i.dueDate, TODAY); b[d <= 0 ? 0 : d <= 30 ? 1 : d <= 60 ? 2 : d <= 90 ? 3 : 4][1] += bal; }
  return b;
}
function agingCard() { const b = agingBuckets(); return barChart(b.map(([l, v], i) => ({ label: t(l), value: R.r2(v), cls: ["ok", "warn", "warn2", "bad", "bad2"][i] })), { fmt: v => money0(v).replace(CUR() + " ", ""), label: t("Aged receivables") }); }

/* ===== 21-spaces.js ===== */
/* Floor plan, space inventory, plans and add-on products. */
const FLOORS = () => Array.from(new Set(DB.spaces.map(s => s.floor || "1"))).sort((a, b) => (a === "B1" ? -1 : b === "B1" ? 1 : a.localeCompare(b, undefined, { numeric: true })));
let FP_FLOOR = null, FP_EDIT = false;
PAGES.floorplan = arg => {
  const floors = FLOORS(); if (!FP_FLOOR || !floors.includes(FP_FLOOR)) FP_FLOOR = floors.includes("12") ? "12" : floors[0];
  const list = DB.spaces.filter(s => (s.floor || "1") === FP_FLOOR);
  const W = Math.max(900, ...list.map(s => (s.x || 0) + (s.w || 60) + 30)), H = Math.max(420, ...list.map(s => (s.y || 0) + (s.h || 50) + 30));
  const counts = { available: 0, occupied: 0, reserved: 0, maintenance: 0 }; list.forEach(s => counts[spaceState(s)]++);
  const rects = list.map(s => { const st = spaceState(s), hd = holderOf(s), small = (s.w || 60) < 70;
    return `<g class="sp st-${st} ty-${s.type}" data-act="space" data-id="${s.id}" tabindex="0" role="button" aria-label="${h(s.code)} ${h(L(st))}" transform="translate(${s.x || 0},${s.y || 0})">
      <rect width="${s.w || 60}" height="${s.h || 50}" rx="8"/><text x="8" y="${small ? 20 : 22}" class="sp-code">${h(s.code)}</text>
      ${small ? "" : `<text x="8" y="40" class="sp-sub">${h(hd ? hd.name.slice(0, Math.floor((s.w || 60) / 7)) : L(st))}</text>`}${s.capacity > 1 && !small ? `<text x="${(s.w || 60) - 8}" y="22" text-anchor="end" class="sp-cap">${s.capacity}👤</text>` : ""}</g>`; }).join("");
  return { title: "Floor plan", html: pageHead(t("Floor plan"), t("Live status of every desk, office and room. Click a space for details and one-click actions."),
    `<div class="seg">${floors.map(f => `<button class="${f === FP_FLOOR ? "on" : ""}" data-act="fp-floor" data-f="${h(f)}">${t("Floor")} ${h(f)}</button>`).join("")}</div>${can("spaces") ? btn(FP_EDIT ? t("Done editing") : t("Edit layout"), "fp-edit", {}, FP_EDIT ? "btn-primary" : "btn-ghost", "btn-fp-edit") : ""}`) +
    `<div class="legend fp-legend">${Object.entries(counts).map(([k, v]) => `<span><i class="sw st-${k}"></i>${L(k)} <b>${v}</b></span>`).join("")}</div>
    ${FP_EDIT ? `<div class="note">${t("Drag spaces to move them. Changes save when you let go.")}</div>` : ""}
    <div class="card fp-card"><svg id="floorplan" class="floorplan ${FP_EDIT ? "editing" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="${t("Floor plan")}"><rect class="fp-bg" width="${W}" height="${H}" rx="14"/>${rects}</svg></div>` };
};
AFTER.floorplan = () => {
  const svg = $("#floorplan"); if (!svg || !FP_EDIT) return;
  let drag = null;
  const pt = ev => { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  svg.addEventListener("pointerdown", ev => { const g = ev.target.closest(".sp"); if (!g) return; const s = byId("spaces", g.dataset.id), p = pt(ev); drag = { g, s, dx: p.x - (s.x || 0), dy: p.y - (s.y || 0), moved: false }; g.setPointerCapture(ev.pointerId); ev.preventDefault(); });
  svg.addEventListener("pointermove", ev => { if (!drag) return; const p = pt(ev); drag.nx = Math.max(0, Math.round((p.x - drag.dx) / 10) * 10); drag.ny = Math.max(0, Math.round((p.y - drag.dy) / 10) * 10); drag.moved = true; drag.g.setAttribute("transform", `translate(${drag.nx},${drag.ny})`); });
  svg.addEventListener("pointerup", async () => { if (!drag) return; const d = drag; drag = null; if (d.moved) { window.__fpNoClick = Date.now(); await save("spaces", Object.assign({}, d.s, { x: d.nx, y: d.ny }), { msg: t("Layout saved") }); } });
};
ACT["fp-floor"] = el => { FP_FLOOR = el.dataset.f; render(); };
ACT["fp-edit"] = () => { FP_EDIT = !FP_EDIT; render(); };
ACT.space = el => { if (FP_EDIT || (window.__fpNoClick && Date.now() - window.__fpNoClick < 400)) return; spaceModal(el.dataset.id); };
document.addEventListener("keydown", ev => { if (ev.key === "Enter" && ev.target.classList && ev.target.classList.contains("sp")) ACT.space(ev.target); });

function spaceModal(id) {
  const s = byId("spaces", id); if (!s) return;
  const st = spaceState(s), hd = holderOf(s), bookable = SHARED.BOOKABLE.includes(s.type);
  const next = DB.bookings.filter(b => b.spaceId === s.id && b.status !== "cancelled" && b.end >= `${TODAY}T${NOW}`).sort((a, b) => a.start < b.start ? -1 : 1).slice(0, 5);
  const price = [s.priceMonth ? `${money(s.priceMonth)} ${t("/ month")}` : "", s.priceDay ? `${money(s.priceDay)} ${t("/ day")}` : "", s.priceHour ? `${money(s.priceHour)} ${t("/ hour")}` : "", bookable && s.creditRate ? `${s.creditRate} ${t("credit(s) / hour")}` : ""].filter(Boolean).join(" · ");
  modal(`${s.code} · ${s.name}`, `<div class="space-sum">${chip(st, "st-" + st)} <span class="hint">${L(s.type)} · ${t("Floor")} ${h(s.floor || "")}${s.capacity ? ` · ${s.capacity} ${t("seats")}` : ""}${s.area ? ` · ${s.area} m²` : ""}</span></div>
    <p><b>${t("Example price")}:</b> ${price || "—"}</p>${s.amenities ? `<p class="hint">${h(s.amenities)}</p>` : ""}${s.note ? `<div class="note">${h(s.note)}</div>` : ""}
    ${hd ? `<p><b>${t("Contracted to")}:</b> ${h(hd.name)} · ${link(hd.contract.number, "contract/" + hd.contract.id)} (${t("until")} ${fmtD(hd.contract.end)})</p>` : ""}
    ${bookable ? `<h4>${t("Next bookings")}</h4>${next.length ? `<ul class="timeline">${next.map(b => `<li><b>${fmtD(b.start)} ${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(memberName(b.memberId))}</span></li>`).join("")}</ul>` : `<p class="hint">${t("Free for now.")}</p>`}` : ""}
    <div class="form-foot">${bookable && can("bookings") ? btn(t("Book this room"), "space-book", { id: s.id }, "btn-primary") : ""}${!bookable && st === "available" && can("contracts") && s.type !== "virtual_office" ? btn(t("New contract for this space"), "space-contract", { id: s.id }, "btn-primary") : ""}
    ${can("spaces") ? `${s.status !== "maintenance" ? btn(t("Mark under maintenance"), "space-status", { id: s.id, s: "maintenance" }) : btn(t("Back in service"), "space-status", { id: s.id, s: "available" })}${btn(t("Edit"), "space-edit", { id: s.id })}` : ""}</div>`);
}
ACT["space-book"] = el => { closeModal(true); bookingModal({ spaceId: el.dataset.id }); };
ACT["space-contract"] = el => { closeModal(true); go("contract/new?space=" + el.dataset.id); };
ACT["space-status"] = async el => { const s = byId("spaces", el.dataset.id); const note = el.dataset.s === "maintenance" ? await promptBox(t("Mark under maintenance"), t("What is being fixed?"), "") : ""; if (note === null) return; if (await save("spaces", Object.assign({}, s, { status: el.dataset.s, note: note || "" }))) { closeModal(); render(); } };
ACT["space-edit"] = el => spaceForm(el.dataset.id);
ACT["space-new"] = () => spaceForm();
function spaceForm(id) {
  const s = id ? byId("spaces", id) : { type: "private_office", floor: FP_FLOOR || "12", status: "available", x: 40, y: 40, w: 120, h: 90, creditRate: 1 };
  modal(id ? t("Edit space") : t("New space"), `<form data-form="space" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Code"), inp("code", s.code, "required maxlength=20"), { req: true })}${fld(t("Name"), inp("name", s.name, "required"), { req: true })}
    ${fld(t("Type"), selInp("type", SHARED.SPACE_TYPES.map(x => [x, L(x)]), s.type))}${fld(t("Floor"), inp("floor", s.floor))}
    ${fld(t("Seats"), numInp("capacity", s.capacity))}${fld(t("Area (m²)"), numInp("area", s.area))}
    ${fld(t("Example price / month"), numInp("priceMonth", s.priceMonth))}${fld(t("Example price / day"), numInp("priceDay", s.priceDay))}
    ${fld(t("Example price / hour"), numInp("priceHour", s.priceHour))}${fld(t("Credits per hour"), numInp("creditRate", s.creditRate), { hint: t("For bookable rooms") })}
    ${fld(t("Status"), selInp("status", SHARED.SPACE_STATUS.map(x => [x, L(x)]), s.status))}${fld(t("Amenities"), inp("amenities", s.amenities))}
    <div class="form-foot wide">${id && can("spaces") ? btn(t("Delete"), "space-del", { id }, "btn-danger-ghost") : ""}<button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.space = async (d, form) => { const id = form.dataset.id, old = id ? byId("spaces", id) : {}; const r = await save("spaces", Object.assign({}, old, d, { id: id || uid("SP") }), { form }); if (r) { closeModal(); render(); } };
ACT["space-del"] = async el => { if (DB.contracts.some(c => (c.spaceIds || []).includes(el.dataset.id)) || DB.bookings.some(b => b.spaceId === el.dataset.id)) return toast(t("This space has contracts or bookings. Mark it under maintenance instead."), "err"); if (await confirmBox(t("Delete this space?"), t("Delete"), true) && await remove("spaces", el.dataset.id)) { closeModal(); render(); } };

PAGES.spaces = () => {
  const rows = DB.spaces.slice().sort((a, b) => SHARED.SPACE_TYPES.indexOf(a.type) - SHARED.SPACE_TYPES.indexOf(b.type) || a.code.localeCompare(b.code, undefined, { numeric: true }));
  const byType = SHARED.SPACE_TYPES.map(ty => { const l = DB.spaces.filter(s => s.type === ty); return `<div class="mini"><b>${l.length}</b><span>${L(ty)}</span></div>`; }).join("");
  return { title: "Spaces & prices", html: pageHead(t("Spaces & prices"), t("Your inventory. Prices shown are example placeholders; set your own."), (can("spaces") ? btn(ic("plus") + t("New space"), "space-new", {}, "btn-primary", "btn-space-new") : "") + btn(t("Export CSV"), "spaces-csv")) +
    `<div class="minis">${byType}</div><div class="card">${filterBox("tbl-spaces")}${table([{ label: "Code", f: s => `<b>${h(s.code)}</b>` }, { label: "Name", k: "name" }, { label: "Type", f: s => L(s.type) }, { label: "Floor", k: "floor" }, { label: "Seats", k: "capacity", cls: "num" },
      { label: "Status", f: s => chip(spaceState(s), "st-" + spaceState(s)) }, { label: "Held by", f: s => { const x = holderOf(s); return x ? h(x.name) : "—"; } }, { label: "Price / month", f: s => s.priceMonth ? money(s.priceMonth) : "—", cls: "num" }, { label: "Price / hour", f: s => s.priceHour ? money(s.priceHour) : "—", cls: "num" }],
      rows, { id: "tbl-spaces", rowAttr: s => `data-act="space" data-id="${s.id}" class="click"` })}</div>` };
};
ACT["spaces-csv"] = () => download(`spaces-${TODAY}.csv`, csv(DB.spaces, [["code", "Code"], ["name", "Name"], [s => L(s.type), "Type"], ["floor", "Floor"], ["capacity", "Seats"], ["area", "Area m2"], [s => spaceState(s), "Status"], ["priceMonth", "Price per month"], ["priceDay", "Price per day"], ["priceHour", "Price per hour"], ["creditRate", "Credits per hour"]]), "text/csv");

PAGES.plans = () => ({ title: "Plans & add-ons", html: pageHead(t("Plans & add-ons"), t("Membership plans set monthly meeting-room credits. Add-ons are billed as charges (printing, coffee, parking…). Prices are example placeholders.")) +
  `<div class="grid-2"><div class="card"><div class="card-head"><h3>${t("Membership plans")}</h3>${can("plans") ? btn(ic("plus") + t("New plan"), "plan-edit", {}, "btn-ghost btn-sm") : ""}</div>
    ${table([{ label: "Plan", k: "name" }, { label: "Type", f: p => L(p.type) }, { label: "Example price", f: p => money(p.price), cls: "num" }, { label: "Room credits / month", k: "credits", cls: "num" }, { label: "Members", f: p => DB.members.filter(m => m.planId === p.id && m.status === "active").length, cls: "num" }], DB.plans, { rowAttr: p => can("plans") ? `data-act="plan-edit" data-id="${p.id}" class="click"` : "" })}</div>
  <div class="card"><div class="card-head"><h3>${t("Add-ons & services")}</h3>${can("products") ? btn(ic("plus") + t("New add-on"), "product-edit", {}, "btn-ghost btn-sm") : ""}</div>
    ${table([{ label: "Name", k: "name" }, { label: "Category", f: p => h(p.category || "") }, { label: "Example price", f: p => money(p.price), cls: "num" }], DB.products, { rowAttr: p => can("products") ? `data-act="product-edit" data-id="${p.id}" class="click"` : "" })}</div></div>
  <div class="card"><h3>${t("How credits work")}</h3><p class="hint">${t("Each plan gives a member a number of credits every calendar month. Each room uses a set number of credits per hour. When a member runs out, the rest of the booking is charged at the room's hourly price and added to the next invoice automatically.")}</p></div>` });
ACT["plan-edit"] = el => { const id = el.dataset.id, p = id ? byId("plans", id) : { type: "hot_desk", credits: 0, price: 0 };
  modal(id ? t("Edit plan") : t("New plan"), `<form data-form="plan" data-id="${h(id || "")}" class="grid-form">${fld(t("Plan name"), inp("name", p.name, "required"), { req: true, wide: true })}${fld(t("Type"), selInp("type", SHARED.SPACE_TYPES.map(x => [x, L(x)]), p.type))}${fld(t("Example price / month"), numInp("price", p.price))}${fld(t("Room credits / month"), numInp("credits", p.credits))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`); };
FORMS.plan = async (d, form) => { const id = form.dataset.id; if (await save("plans", Object.assign({}, id ? byId("plans", id) : {}, d, { id: id || uid("PL") }), { form })) { closeModal(); render(); } };
ACT["product-edit"] = el => { const id = el.dataset.id, p = id ? byId("products", id) : { price: 0 };
  modal(id ? t("Edit add-on") : t("New add-on"), `<form data-form="product" data-id="${h(id || "")}" class="grid-form">${fld(t("Name"), inp("name", p.name, "required"), { req: true, wide: true })}${fld(t("Category"), selInp("category", ["printing", "coffee", "parking", "catering", "mail", "virtual_office", "other"].map(x => [x, L(x)]), p.category))}${fld(t("Example price"), numInp("price", p.price))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`); };
FORMS.product = async (d, form) => { const id = form.dataset.id; if (await save("products", Object.assign({}, id ? byId("products", id) : {}, d, { id: id || uid("PR") }), { form })) { closeModal(); render(); } };

/* ===== 22-bookings.js ===== */
/* Room calendar (day + week), bookings list and the booking form with live credit preview. */
let CAL_DAY = null, CAL_VIEW = "day";
const roomList = () => DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type)).sort((a, b) => (a.type === b.type ? 0 : a.type === "meeting_room" ? -1 : 1) || Number(a.capacity) - Number(b.capacity));
const hm2m = s => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
function calGrid(day, rooms, bookings, o) {
  o = o || {}; const c = cfg(), from = hm2m(c.openFrom || "07:00"), to = hm2m(c.openTo || "22:00"), span = to - from;
  const hours = []; for (let m = from; m < to; m += 60) hours.push(m);
  const nowM = day === TODAY ? hm2m(NOW) : -1;
  return `<div class="cal" style="--cols:${span / 30}"><div class="cal-head"><div class="cal-room"></div><div class="cal-track hdr">${hours.map(m => `<span style="left:${100 * (m - from) / span}%">${pad2(Math.floor(m / 60))}:00</span>`).join("")}</div></div>
    ${rooms.map(s => `<div class="cal-row"><div class="cal-room"><b>${h(s.name)}</b><small>${s.capacity} ${t("seats")} · ${s.creditRate} ${t("cr/h")}</small></div><div class="cal-track ${s.status === "maintenance" ? "maint" : ""}">
      ${o.click !== false ? Array.from({ length: span / 30 }, (_, i) => { const m = from + i * 30, v = `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; const past = day < TODAY || (day === TODAY && m + 30 <= nowM); return `<button class="slot ${past ? "past" : ""}" style="left:${100 * i * 30 / span}%;width:${100 * 30 / span}%" data-act="${o.slotAct || "cal-slot"}" data-space="${s.id}" data-t="${v}" aria-label="${h(s.name)} ${v}" ${past ? "disabled" : ""}></button>`; }).join("") : ""}
      ${bookings.filter(b => b.spaceId === s.id && b.start.slice(0, 10) === day && b.status !== "cancelled").map(b => { const a = hm2m(b.start.slice(11)), e = hm2m(b.end.slice(11)); const mine = o.mine && o.mine(b);
        return `<div class="bk ${b.private ? "priv" : ""} ${mine ? "mine" : ""} bk-${b.status}" style="left:${100 * (a - from) / span}%;width:${100 * (e - a) / span}%" ${!b.private && o.open !== false ? `data-act="bk-open" data-id="${b.id}" role="button" tabindex="0"` : ""} title="${h(b.start.slice(11))}–${h(b.end.slice(11))} ${h(b.private ? t("Booked") : (b.title || ""))}"><b>${h(b.start.slice(11))}–${h(b.end.slice(11))}</b><span>${h(b.private ? t("Booked") : (o.label ? o.label(b) : memberName(b.memberId)))}</span></div>`; }).join("")}
      ${nowM >= from && nowM <= to ? `<i class="now" style="left:${100 * (nowM - from) / span}%"></i>` : ""}</div></div>`).join("")}</div>`;
}
PAGES.calendar = () => {
  if (!CAL_DAY) CAL_DAY = TODAY;
  const rooms = roomList(), d = new Date(CAL_DAY + "T00:00:00");
  const dayName = d.toLocaleDateString(LANG === "en" ? "en-GB" : LANG, { weekday: "long" });
  let body;
  if (CAL_VIEW === "day") body = calGrid(CAL_DAY, rooms, DB.bookings);
  else {
    const days = Array.from({ length: 7 }, (_, i) => R.addDays(CAL_DAY, i));
    body = `<div class="table-wrap"><table class="tbl week"><thead><tr><th>${t("Room")}</th>${days.map(x => `<th>${new Date(x + "T00:00:00").toLocaleDateString(LANG === "en" ? "en-GB" : LANG, { weekday: "short" })}<br><small>${fmtD(x)}</small></th>`).join("")}</tr></thead><tbody>
      ${rooms.map(s => `<tr><td data-label="${t("Room")}"><b>${h(s.name)}</b></td>${days.map(x => { const l = DB.bookings.filter(b => b.spaceId === s.id && b.start.slice(0, 10) === x && b.status !== "cancelled").sort((a, b) => a.start < b.start ? -1 : 1); const hrs = sum(l, b => R.hoursBetween(b.start, b.end));
        return `<td data-label="${fmtD(x)}" class="wk ${x === TODAY ? "today" : ""}"><button class="wk-cell" data-act="wk-day" data-d="${x}">${l.length ? `<b>${l.length}</b> · ${hrs.toFixed(1)} h${meter(100 * hrs / 15)}` : `<span class="hint">${t("free")}</span>`}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  return { title: "Room calendar", html: pageHead(t("Room calendar"), t("Click an empty slot to book. Members' credits are used first; anything beyond is charged at the example hourly price."),
    `<div class="seg"><button class="${CAL_VIEW === "day" ? "on" : ""}" data-act="cal-view" data-v="day">${t("Day")}</button><button class="${CAL_VIEW === "week" ? "on" : ""}" data-act="cal-view" data-v="week">${t("Week")}</button></div>
     <div class="seg"><button data-act="cal-move" data-n="-1" aria-label="${t("Previous")}">‹</button><button data-act="cal-move" data-n="0">${t("Today")}</button><button data-act="cal-move" data-n="1" aria-label="${t("Next")}">›</button></div>
     ${can("bookings") ? btn(ic("plus") + t("New booking"), "bk-new", {}, "btn-primary", "btn-bk-new") : ""}`) +
    `<div class="cal-title"><h3>${h(dayName)} ${fmtD(CAL_DAY)}${CAL_VIEW === "week" ? " – " + fmtD(R.addDays(CAL_DAY, 6)) : ""}</h3><form class="inline" data-form="cal-jump">${dateInp("d", CAL_DAY, `aria-label="${t("Go to date")}"`)}<button class="btn btn-ghost btn-sm">${t("Go")}</button></form></div>
    <div class="card cal-card" id="calendar">${body}</div>` };
};
FORMS["cal-jump"] = d => { if (d.d) { CAL_DAY = d.d; render(); } };
ACT["cal-view"] = el => { CAL_VIEW = el.dataset.v; render(); };
ACT["cal-move"] = el => { const n = Number(el.dataset.n); CAL_DAY = n === 0 ? TODAY : R.addDays(CAL_DAY || TODAY, n * (CAL_VIEW === "week" ? 7 : 1)); render(); };
ACT["wk-day"] = el => { CAL_DAY = el.dataset.d; CAL_VIEW = "day"; render(); };
ACT["cal-slot"] = el => { if (!can("bookings")) return toast(t("Your role cannot book rooms."), "err"); const s = Math.min(hm2m(el.dataset.t) + 60, 22 * 60); bookingModal({ spaceId: el.dataset.space, date: CAL_DAY, from: el.dataset.t, to: `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}` }); };
ACT["bk-new"] = () => bookingModal({ date: CAL_DAY || TODAY });
ACT["bk-open"] = el => bookingModal({ id: el.dataset.id });

function bookingModal(o) {
  o = o || {}; const b = o.id ? byId("bookings", o.id) : null;
  const rooms = DB.spaces.filter(s => SHARED.BOOKABLE.includes(s.type));
  const sp = b ? b.spaceId : (o.spaceId || (roomList()[0] || {}).id), date = b ? b.start.slice(0, 10) : (o.date || TODAY);
  const from = b ? b.start.slice(11) : (o.from || (date === TODAY ? nextHalf() : "09:00")), to = b ? b.end.slice(11) : (o.to || addMin(from, 60));
  const ro = b && !can("bookings");
  modal(b ? t("Booking") : t("New booking"), `<form data-form="booking" data-id="${h(b ? b.id : "")}" class="grid-form" id="booking-form">
    ${fld(t("Room / space"), `<select name="spaceId" data-live="bk-preview" required>${opts(rooms.map(s => [s.id, `${s.name} (${s.capacity} ${t("seats")}${s.status === "maintenance" ? " · " + L("maintenance") : ""})`]), sp)}</select>`, { req: true })}
    ${fld(t("Member"), `<select name="memberId" data-live="bk-preview">${memberOpts(b ? b.memberId : (o.memberId || ""), t("— walk-in / no member —"))}</select>`)}
    ${fld(t("Date"), dateInp("date", date, 'required data-live="bk-preview"'), { req: true })}
    <div class="fld-pair">${fld(t("From"), `<select name="from" data-live="bk-preview">${timeOpts(from)}</select>`)}${fld(t("To"), `<select name="to" data-live="bk-preview">${timeOpts(to, 7, 22)}</select>`)}</div>
    ${fld(t("Title"), inp("title", b ? b.title : "", `placeholder="${t("e.g. Client meeting")}"`))}${fld(t("Attendees"), numInp("attendees", b ? b.attendees : 2))}
    ${fld(t("Status"), selInp("status", ["confirmed", "tentative", "checked_in", "cancelled"].map(x => [x, L(x)]), b ? b.status : "confirmed"))}
    ${fld(t("Notes"), inp("notes", b ? b.notes : ""))}
    <div class="wide" id="bk-preview"></div>
    <div class="form-foot wide">${b && can("bookings") && b.status !== "cancelled" ? btn(t("Cancel booking"), "bk-cancel", { id: b.id }, "btn-danger-ghost", "btn-bk-cancel") : ""}${ro ? "" : `<button class="btn btn-primary" id="btn-bk-save">${b ? t("Save") : t("Book")}</button>`}</div></form>`, { wide: true });
  LIVE["bk-preview"]();
}
const nextHalf = () => { const m = Math.min(hm2m("21:00"), Math.ceil((hm2m(NOW) + 1) / 30) * 30); return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
const addMin = (s, n) => { const m = Math.min(hm2m("22:00"), hm2m(s) + n); return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
LIVE["bk-preview"] = () => {
  const f = $("#booking-form"); if (!f) return; const box = $("#bk-preview");
  const sp = byId("spaces", f.spaceId.value), date = parseD(f.date.value), m = byId("members", f.memberId.value), id = f.dataset.id;
  if (!sp || !date) { box.innerHTML = ""; return; }
  const rec = { id: id || "__new", start: `${date}T${f.from.value}`, end: `${date}T${f.to.value}` };
  if (rec.end <= rec.start) { box.innerHTML = `<div class="note warn">${t("End time must be after the start time")}</div>`; return; }
  const clash = DB.bookings.find(b => b.id !== id && b.spaceId === sp.id && b.status !== "cancelled" && b.start < rec.end && rec.start < b.end);
  const [cr, oh, oa] = R.priceBooking(rec, sp, m, DB.bookings, DB.plans);
  const left = m ? R.creditsLeft(m, date, DB.bookings, DB.plans, id) : 0;
  box.innerHTML = `${clash ? `<div class="note bad">${ic("alert")} ${t("Already booked")} ${clash.start.slice(11)}–${clash.end.slice(11)} (${h(clash.private ? t("Booked") : memberName(clash.memberId))})</div>` : `<div class="note ok">${ic("check")} ${t("Room is free at this time")}</div>`}
    <div class="price-box"><div><small>${t("Duration")}</small><b>${R.hoursBetween(rec.start, rec.end)} h</b></div><div><small>${t("Credits used")}</small><b>${cr}</b>${m ? `<small>${t("of")} ${left} ${t("left this month")}</small>` : ""}</div><div><small>${t("Pay-as-you-go")}</small><b>${money(oa)}</b><small>${oh ? oh + " h × " + money(sp.priceHour) + " + " + (cfg().vatName || "VAT") : t("nothing extra")}</small></div></div>`;
};
FORMS.booking = async (d, form) => {
  const id = form.dataset.id, old = id ? byId("bookings", id) : {};
  const rec = Object.assign({}, old, { spaceId: d.spaceId, memberId: d.memberId, start: `${d.date}T${d.from}`, end: `${d.date}T${d.to}`, title: d.title, attendees: d.attendees || 1, status: d.status, notes: d.notes, id: id || uid("BK") });
  const r = await save("bookings", rec, { form, msg: id ? t("Booking updated") : t("Room booked") }); if (r) { closeModal(); render(); }
};
ACT["bk-cancel"] = async el => { const b = byId("bookings", el.dataset.id); if (!(await confirmBox(t("Cancel this booking? Credits go back to the member."), t("Cancel booking"), true))) return; if (await save("bookings", Object.assign({}, b, { status: "cancelled" }), { msg: t("Booking cancelled") })) { closeModal(); render(); } };

PAGES.bookings = () => {
  const rows = DB.bookings.slice().sort((a, b) => a.start < b.start ? 1 : -1);
  return { title: "All bookings", html: pageHead(t("All bookings"), t("Every room booking, newest first."), (can("bookings") ? btn(ic("plus") + t("New booking"), "bk-new", {}, "btn-primary") : "") + btn(t("Export CSV"), "bk-csv")) +
    `<div class="card">${filterBox("tbl-bk")}${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Member", f: b => h(memberName(b.memberId)) }, { label: "Title", k: "title" },
      { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Extra charge", f: b => b.overageAmount ? money(b.overageAmount) : "—", cls: "num" }, { label: "Status", f: b => chip(b.status) }], rows, { id: "tbl-bk", rowAttr: b => `data-act="bk-open" data-id="${b.id}" class="click"` })}</div>` };
};
ACT["bk-csv"] = () => download(`bookings-${TODAY}.csv`, csv(DB.bookings, [[b => fmtD(b.start), "Date"], [b => b.start.slice(11), "From"], [b => b.end.slice(11), "To"], [b => spaceName(b.spaceId), "Room"], [b => memberName(b.memberId), "Member"], ["title", "Title"], ["creditsUsed", "Credits"], ["overageAmount", "Extra charge"], ["status", "Status"]]), "text/csv");

/* ===== 23-crm.js ===== */
/* Members, companies, lead pipeline, tours and quotes. */
const planName = id => (byId("plans", id) || {}).name || "—";
PAGES.members = () => {
  const rows = DB.members.slice().sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status === "active" ? -1 : 1));
  return { title: "Members", html: pageHead(t("Members"), `${DB.members.filter(m => m.status === "active").length} ${t("active members")}`, (can("members") ? btn(ic("plus") + t("Add member"), "member-new", {}, "btn-primary", "btn-member-new") : "") + btn(t("Export CSV"), "members-csv")) +
    `<div class="card">${filterBox("tbl-members", t("Filter by name, company, card…"))}${table([{ label: "Name", f: m => `<b>${h(m.name)}</b><small class="sub-line">${h(m.email || "")}</small>` }, { label: "Company", f: m => m.companyId ? h((byId("companies", m.companyId) || {}).legalName) : "—" }, { label: "Plan", f: m => h(planName(m.planId)) },
      { label: "Credits left", f: m => R.creditsLeft(m, TODAY, DB.bookings, DB.plans), cls: "num" }, { label: "Card", f: m => h(m.cardNo || "—") + (m.cardBlocked ? " " + chip("denied") : "") }, { label: "Since", f: m => fmtD(m.start) }, { label: "Status", f: m => chip(m.status) }], rows, { id: "tbl-members", rowAttr: m => `data-go="member/${m.id}" class="click"` })}</div>` };
};
ACT["members-csv"] = () => download(`members-${TODAY}.csv`, csv(DB.members, [["id", "ID"], ["name", "Name"], ["email", "Email"], ["phone", "Phone"], [m => (byId("companies", m.companyId) || {}).legalName || "", "Company"], [m => planName(m.planId), "Plan"], ["cardNo", "Card"], [m => fmtD(m.start), "Start"], ["status", "Status"]]), "text/csv");
ACT["member-new"] = () => memberModal();
function memberModal(id) {
  const m = id ? byId("members", id) : { status: "active", start: TODAY };
  modal(id ? t("Edit member") : t("Add member"), `<form data-form="member" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Full name"), inp("name", m.name, "required"), { req: true })}${fld(t("Email"), inp("email", m.email, 'type="email"'))}${fld(t("Mobile"), inp("phone", m.phone, 'type="tel"'))}
    ${fld(t("Company"), selInp("companyId", DB.companies.map(c => [c.id, c.legalName]), m.companyId, t("— individual —")))}${fld(t("Plan"), selInp("planId", DB.plans.map(p => [p.id, `${p.name} · ${p.credits} ${t("credits")}`]), m.planId, "—"))}
    ${fld(t("Extra credits this month"), numInp("extraCredits", m.extraCredits || 0))}${fld(t("Access card no."), inp("cardNo", m.cardNo))}${fld(t("Start date"), dateInp("start", m.start), { req: true })}${fld(t("End date"), dateInp("end", m.end))}
    ${fld(t("Status"), selInp("status", ["active", "paused", "ended"].map(x => [x, L(x)]), m.status))}${fld(t("Address (for invoices)"), inp("address", m.address))}${fld(t("TRN (if VAT-registered)"), inp("trn", m.trn))}
    <div class="form-foot wide"><button class="btn btn-primary" id="btn-member-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.member = async (d, form) => { const id = form.dataset.id; const r = await save("members", Object.assign({}, id ? byId("members", id) : {}, d, { id: id || nextMemberId() }), { form }); if (r) { closeModal(); id ? render() : go("member/" + r.id); } };
function nextMemberId() { let n = 0; DB.members.forEach(m => { const x = /^M-(\d+)$/.exec(m.id); if (x) n = Math.max(n, Number(x[1])); }); return "M-" + String(n + 1).padStart(4, "0"); }
PAGES.member = id => {
  const m = byId("members", id); if (!m) return empty(t("Member not found."));
  const co = byId("companies", m.companyId), left = R.creditsLeft(m, TODAY, DB.bookings, DB.plans), allow = R.allowance(m, DB.plans);
  const bks = DB.bookings.filter(b => b.memberId === id).sort((a, b) => a.start < b.start ? 1 : -1).slice(0, 12);
  const invs = DB.invoices.filter(i => i.memberId === id || (m.companyId && i.companyId === m.companyId)).sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 8);
  return { title: m.name, html: pageHead(m.name, `${chip(m.status)} ${co ? link(co.legalName, "company/" + co.id) : t("Individual member")} · ${h(planName(m.planId))}`,
    (can("members") ? btn(t("Edit"), "member-edit", { id }) : "") + (can("bookings") ? btn(t("Book a room"), "member-book", { id }, "btn-ghost") : "") + (can("charges") ? btn(t("Add charge"), "member-charge", { id }) : "") + (can("members") ? btn(m.cardBlocked ? t("Unblock card") : t("Block card"), "member-card", { id }, m.cardBlocked ? "btn-ghost" : "btn-danger-ghost") : "") + (ME.role === "admin" ? btn(t("Portal login"), "member-portal", { id }) : "")) +
    `<div class="kpis">${kpi(t("Credits left this month"), `${left} / ${allow}`, t("meeting-room credits"), "cal", "violet", meter(allow ? 100 * left / allow : 0))}${kpi(t("Access card"), h(m.cardNo || "—"), m.cardBlocked ? t("blocked") : t("active"), "card", m.cardBlocked ? "red" : "teal")}${kpi(t("Member since"), fmtD(m.start), m.end ? t("until") + " " + fmtD(m.end) : "", "users", "blue")}${kpi(t("Check-ins (30 days)"), DB.checkins.filter(c => c.memberId === id && c.date >= R.addDays(TODAY, -30)).length, "", "check", "green")}</div>
    <div class="grid-2"><div class="card"><h3>${t("Details")}</h3><dl class="dl"><dt>${t("Email")}</dt><dd>${h(m.email || "—")}</dd><dt>${t("Mobile")}</dt><dd>${h(m.phone || "—")}</dd><dt>${t("Address")}</dt><dd>${h(m.address || "—")}</dd><dt>ID</dt><dd>${h(m.id)}</dd></dl></div>
    <div class="card"><div class="card-head"><h3>${t("Bookings")}</h3></div>${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Status", f: b => chip(b.status) }], bks, { rowAttr: b => `data-act="bk-open" data-id="${b.id}" class="click"` })}</div></div>
    <div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div>` };
};
ACT["member-edit"] = el => memberModal(el.dataset.id);
ACT["member-book"] = el => bookingModal({ memberId: el.dataset.id, date: TODAY });
ACT["member-charge"] = el => chargeModal({ memberId: el.dataset.id });
ACT["member-card"] = async el => { const m = byId("members", el.dataset.id); if (await save("members", Object.assign({}, m, { cardBlocked: !m.cardBlocked }), { msg: m.cardBlocked ? t("Card unblocked") : t("Card blocked") })) render(); };
ACT["member-portal"] = el => { const m = byId("members", el.dataset.id); userModal({ username: (m.email || m.name).split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "."), name: m.name, role: "member", memberId: m.id, isNew: true }); };

PAGES.companies = () => ({ title: "Companies", html: pageHead(t("Companies"), t("Client companies: legal name, trade licence and TRN as printed on tax invoices."), can("companies") ? btn(ic("plus") + t("Add company"), "company-new", {}, "btn-primary") : "") +
  `<div class="card">${filterBox("tbl-co")}${table([{ label: "Legal name", f: c => `<b>${h(c.legalName)}</b>` }, { label: cfg().taxLabel || "TRN", k: "trn" }, { label: "Trade licence", f: c => h(c.licenceNo || "—") + (c.licenceExpiry ? `<small class="sub-line">${t("expires")} ${fmtD(c.licenceExpiry)}</small>` : "") },
    { label: "Members", f: c => DB.members.filter(m => m.companyId === c.id && m.status === "active").length, cls: "num" }, { label: "Monthly value", f: c => money(sum(DB.contracts.filter(x => x.companyId === c.id && contractCovers(x, TODAY)), monthlyValue)), cls: "num" },
    { label: "Balance due", f: c => money(sum(openInvoices().filter(i => i.companyId === c.id), invBal)), cls: "num" }], DB.companies.slice().sort((a, b) => a.legalName.localeCompare(b.legalName)), { id: "tbl-co", rowAttr: c => `data-go="company/${c.id}" class="click"` })}</div>` });
ACT["company-new"] = () => companyModal();
function companyModal(id) {
  const c = id ? byId("companies", id) : { status: "active", since: TODAY }, tl = cfg().taxLabel || "TRN";
  modal(id ? t("Edit company") : t("Add company"), `<form data-form="company" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Legal name (as on trade licence)"), inp("legalName", c.legalName, "required"), { req: true, wide: true })}${fld(tl, inp("trn", c.trn, 'inputmode="numeric"'), { hint: cfg().taxIdDigits ? `${cfg().taxIdDigits} ${t("digits")}` : "" })}${fld(t("Email (billing)"), inp("email", c.email, 'type="email"'))}
    ${fld(t("Phone"), inp("phone", c.phone))}${fld(t("Trade licence no."), inp("licenceNo", c.licenceNo))}${fld(t("Licensing authority"), inp("licenceAuthority", c.licenceAuthority))}${fld(t("Licence expiry"), dateInp("licenceExpiry", c.licenceExpiry))}
    ${fld(t("Address (printed on invoices)"), txt("address", c.address), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.company = async (d, form) => { const id = form.dataset.id; const r = await save("companies", Object.assign({}, id ? byId("companies", id) : {}, d, { id: id || uid("CO") }), { form }); if (r) { closeModal(); id ? render() : go("company/" + r.id); } };
PAGES.company = id => {
  const c = byId("companies", id); if (!c) return empty(t("Company not found."));
  const ms = DB.members.filter(m => m.companyId === id), cts = DB.contracts.filter(x => x.companyId === id), invs = DB.invoices.filter(i => i.companyId === id).sort((a, b) => a.date < b.date ? 1 : -1);
  return { title: c.legalName, html: pageHead(c.legalName, `${h(cfg().taxLabel || "TRN")} ${h(c.trn || "—")} · ${t("Trade licence")} ${h(c.licenceNo || "—")}`, (can("companies") ? btn(t("Edit"), "company-edit", { id }) : "") + (can("contracts") ? btn(t("New contract"), "company-contract", { id }, "btn-primary") : "") + (can("charges") ? btn(t("Add charge"), "company-charge", { id }) : "")) +
    `<div class="grid-2"><div class="card"><h3>${t("Details")}</h3><dl class="dl"><dt>${t("Address")}</dt><dd>${h(c.address || "—")}</dd><dt>${t("Email")}</dt><dd>${h(c.email || "—")}</dd><dt>${t("Phone")}</dt><dd>${h(c.phone || "—")}</dd><dt>${t("Licensing authority")}</dt><dd>${h(c.licenceAuthority || "—")}</dd><dt>${t("Licence expiry")}</dt><dd>${fmtD(c.licenceExpiry) || "—"}</dd></dl></div>
    <div class="card"><h3>${t("Members")}</h3>${table([{ label: "Name", f: m => link(m.name, "member/" + m.id) }, { label: "Plan", f: m => h(planName(m.planId)) }, { label: "Status", f: m => chip(m.status) }], ms)}</div></div>
    <div class="card"><h3>${t("Contracts")}</h3>${contractTable(cts)}</div><div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div>` };
};
ACT["company-edit"] = el => companyModal(el.dataset.id);
ACT["company-contract"] = el => go("contract/new?party=c:" + el.dataset.id);
ACT["company-charge"] = el => chargeModal({ companyId: el.dataset.id });

/* ---------------- lead pipeline */
PAGES.leads = () => {
  const cols = SHARED.LEAD_STAGES;
  return { title: "Lead pipeline", html: pageHead(t("Lead pipeline"), t("Move a lead along with one click. Book a tour, send a quote, then convert it to a member."), (can("leads") ? btn(ic("plus") + t("New lead"), "lead-new", {}, "btn-primary", "btn-lead-new") : "") + btn(t("Export CSV"), "leads-csv")) +
    `<div class="kanban" id="pipeline">${cols.map(st => { const l = DB.leads.filter(x => x.stage === st); return `<div class="kcol k-${st}"><div class="khead"><b>${L(st)}</b><span>${l.length}</span><small>${money0(sum(l, x => x.budget))}</small></div>
      ${l.map(x => `<div class="kcard" data-act="lead-open" data-id="${x.id}" role="button" tabindex="0"><b>${h(x.name)}</b><small>${h(x.company || t("Individual"))}</small><div class="kmeta">${chip(x.interest || "other", "c-type")}<span>${money0(x.budget)}</span></div>
        ${can("leads") && !["won", "lost"].includes(st) ? `<div class="kact"><button class="mini-btn" data-act="lead-move" data-id="${x.id}" data-d="1" title="${t("Move to next stage")}">${t("Next")} ›</button></div>` : ""}</div>`).join("")}</div>`; }).join("")}</div>` };
};
ACT["leads-csv"] = () => download(`leads-${TODAY}.csv`, csv(DB.leads, [["name", "Name"], ["company", "Company"], ["email", "Email"], ["phone", "Phone"], ["stage", "Stage"], ["interest", "Interest"], ["budget", "Budget / month"], ["source", "Source"], [l => fmtD(l.created), "Created"]]), "text/csv");
ACT["lead-new"] = () => leadModal();
ACT["lead-open"] = el => leadModal(el.dataset.id);
ACT["lead-move"] = async (el, ev) => { ev.stopPropagation(); const l = byId("leads", el.dataset.id), i = SHARED.LEAD_STAGES.indexOf(l.stage); const nx = SHARED.LEAD_STAGES[Math.min(i + 1, 5)]; if (await save("leads", Object.assign({}, l, { stage: nx }), { msg: `${l.name} → ${L(nx)}` })) render(); };
function leadModal(id) {
  const l = id ? byId("leads", id) : { stage: "new", interest: "private_office", source: "Website", created: TODAY };
  const tours = id ? DB.tours.filter(x => x.leadId === id) : [], quotes = id ? DB.quotes.filter(q => q.leadId === id) : [];
  modal(id ? l.name : t("New lead"), `<form data-form="lead" data-id="${h(id || "")}" class="grid-form">
    ${fld(t("Name"), inp("name", l.name, "required"), { req: true })}${fld(t("Company"), inp("company", l.company))}${fld(t("Email"), inp("email", l.email, 'type="email"'))}${fld(t("Mobile"), inp("phone", l.phone))}
    ${fld(t("Stage"), selInp("stage", SHARED.LEAD_STAGES.map(x => [x, L(x)]), l.stage))}${fld(t("Interested in"), selInp("interest", SHARED.SPACE_TYPES.map(x => [x, L(x)]), l.interest))}
    ${fld(t("Budget / month"), numInp("budget", l.budget))}${fld(t("Source"), selInp("source", ["Website", "Walk-in", "Referral", "Broker", "Google", "Instagram", "LinkedIn", "Other"], l.source))}
    ${fld(t("Notes"), txt("notes", l.notes), { wide: true })}
    ${id ? `<div class="wide"><h4>${t("Tours")}</h4>${tours.length ? tourList(tours) : `<p class="hint">${t("No tours yet.")}</p>`}<h4>${t("Quotes")}</h4>${quotes.length ? quotes.map(q => `<p>${link(q.number, "quote/" + q.id)} · ${money(q.total)} · ${chip(q.status)}</p>`).join("") : `<p class="hint">${t("No quotes yet.")}</p>`}</div>` : ""}
    <div class="form-foot wide">${id && can("tours") ? btn(t("Book a tour"), "lead-tour", { id }) : ""}${id && can("quotes") ? btn(t("Create quote"), "lead-quote", { id }) : ""}${id && canAct("convert_lead") && !l.memberId ? btn(t("Convert to member"), "lead-convert", { id }, "btn-ghost", "btn-lead-convert") : ""}${l.memberId ? link(t("Open member"), "member/" + l.memberId) : ""}${can("leads") ? `<button class="btn btn-primary">${t("Save")}</button>` : ""}</div></form>`, { wide: true });
}
FORMS.lead = async (d, form) => { const id = form.dataset.id; if (await save("leads", Object.assign({}, id ? byId("leads", id) : {}, d, { id: id || uid("LD") }), { form })) { closeModal(); render(); } };
ACT["lead-tour"] = el => tourModal({ leadId: el.dataset.id });
ACT["lead-quote"] = el => { closeModal(true); go("quote/new?lead=" + el.dataset.id); };
ACT["lead-convert"] = async el => {
  const l = byId("leads", el.dataset.id);
  modal(t("Convert to member"), `<form data-form="convert" data-id="${l.id}" class="grid-form"><p class="wide">${t("Creates the member")}${l.company ? " " + t("and the company") : ""} ${t("and marks the lead as won.")}</p>${fld(t("Plan"), selInp("planId", DB.plans.map(p => [p.id, p.name]), "", "—"), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-convert-go">${t("Convert")}</button></div></form>`);
};
FORMS.convert = async (d, form) => { const r = await act("convert_lead", { id: form.dataset.id, planId: d.planId }, t("Member created")); if (r) { closeModal(); go("member/" + r.memberId); } };

/* ---------------- tours */
function tourList(l) { return l.length ? `<ul class="timeline">${l.map(x => { const ld = byId("leads", x.leadId); return `<li><b>${fmtDT(x.when)}</b><span>${h(ld ? ld.name + (ld.company ? " · " + ld.company : "") : x.name || "")}</span><small>${chip(x.status)} ${can("tours") && x.status === "booked" ? btn(t("Done"), "tour-done", { id: x.id }, "mini-btn") : ""}</small></li>`; }).join("")}</ul>` : empty(t("No tours booked.")); }
PAGES.tours = () => ({ title: "Tours", html: pageHead(t("Tours"), t("Show prospects around. Mark a tour done to move the lead on."), can("tours") ? btn(ic("plus") + t("Book a tour"), "tour-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "When", f: x => fmtDT(x.when) }, { label: "Lead", f: x => { const l = byId("leads", x.leadId); return l ? `<a href="#" data-act="lead-open" data-id="${l.id}">${h(l.name)}</a>` : h(x.name || ""); } }, { label: "Company", f: x => h((byId("leads", x.leadId) || {}).company || "") }, { label: "Status", f: x => chip(x.status) }, { label: "", f: x => can("tours") && x.status === "booked" ? btn(t("Done"), "tour-done", { id: x.id }, "btn-ghost btn-sm") + btn(L("no_show"), "tour-noshow", { id: x.id }, "btn-ghost btn-sm") : "" }], DB.tours.slice().sort((a, b) => a.when < b.when ? 1 : -1))}</div>` });
ACT["tour-new"] = () => tourModal();
function tourModal(o) {
  o = o || {};
  modal(t("Book a tour"), `<form data-form="tour" class="grid-form">${fld(t("Lead"), selInp("leadId", DB.leads.filter(l => !["won", "lost"].includes(l.stage)).map(l => [l.id, l.name + (l.company ? " · " + l.company : "")]), o.leadId, t("— choose —")), { wide: true })}
    ${fld(t("Date"), dateInp("date", R.addDays(TODAY, 1), "required"), { req: true })}${fld(t("Time"), `<select name="time">${timeOpts("11:00", 8, 20)}</select>`)}${fld(t("Notes"), inp("notes", ""), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Book tour")}</button></div></form>`);
}
FORMS.tour = async (d, form) => { const r = await save("tours", { id: uid("TR"), leadId: d.leadId, when: `${d.date}T${d.time}`, status: "booked", notes: d.notes, staff: ME.username }, { form, msg: t("Tour booked") }); if (r) { const l = byId("leads", d.leadId); if (l && ["new", "contacted"].includes(l.stage)) await save("leads", Object.assign({}, l, { stage: "tour" }), { toast: false }); closeModal(); render(); } };
ACT["tour-done"] = async el => { const x = byId("tours", el.dataset.id); if (await save("tours", Object.assign({}, x, { status: "done" }))) { const l = byId("leads", x.leadId); if (l && SHARED.LEAD_STAGES.indexOf(l.stage) < 3) await save("leads", Object.assign({}, l, { stage: "proposal" }), { toast: false }); render(); } };
ACT["tour-noshow"] = async el => { const x = byId("tours", el.dataset.id); if (await save("tours", Object.assign({}, x, { status: "no_show" }))) render(); };

/* ---------------- quotes */
PAGES.quotes = () => ({ title: "Quotes", html: pageHead(t("Quotes"), t("Proposals for leads and clients. Prices are example placeholders."), can("quotes") ? btn(ic("plus") + t("New quote"), "quote-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "Number", f: q => `<b>${h(q.number)}</b>` }, { label: "Date", f: q => fmtD(q.date) }, { label: "For", f: q => h(q.leadId ? ((byId("leads", q.leadId) || {}).company || (byId("leads", q.leadId) || {}).name) : partyName(q)) }, { label: "Valid until", f: q => fmtD(q.validUntil) }, { label: "Total", f: q => money(q.total), cls: "num" }, { label: "Status", f: q => chip(q.status) }], DB.quotes.slice().sort((a, b) => a.date < b.date ? 1 : -1), { rowAttr: q => `data-go="quote/${q.id}" class="click"` })}</div>` });
ACT["quote-new"] = () => go("quote/new");
PAGES.quote = arg => {
  const isNew = arg.startsWith("new"), q = isNew ? { lines: [{ desc: "", qty: 1, price: 0 }], date: TODAY, validUntil: R.addDays(TODAY, 14), status: "draft", leadId: (/lead=([^&]+)/.exec(arg) || [])[1] || "" } : byId("quotes", arg);
  if (!q) return empty(t("Quote not found."));
  const ro = !can("quotes");
  return { title: isNew ? "New quote" : q.number, html: pageHead(isNew ? t("New quote") : `${t("Quote")} ${q.number}`, isNew ? "" : chip(q.status), !isNew ? btn(ic("print") + t("Print"), "print-doc", { kind: "quote", id: q.id }) : "") +
    `<form data-form="quote" data-id="${h(isNew ? "" : q.id)}" class="card grid-form" id="quote-form">
      ${fld(t("Lead"), selInp("leadId", DB.leads.map(l => [l.id, l.name + (l.company ? " · " + l.company : "")]), q.leadId, "—"))}${fld(t("Or client"), `<select name="party"><option value="">—</option>${partyOptions(partyKeyOf(q))}</select>`)}
      ${fld(t("Date"), dateInp("date", q.date))}${fld(t("Valid until"), dateInp("validUntil", q.validUntil))}${fld(t("Status"), selInp("status", ["draft", "sent", "accepted", "declined", "expired"].map(x => [x, L(x)]), q.status))}
      <div class="wide">${linesEditor(q.lines, ro)}</div>${fld(t("Notes"), txt("notes", q.notes), { wide: true })}
      <div class="form-foot wide">${ro ? "" : `<button class="btn btn-primary">${t("Save quote")}</button>`}</div></form>` };
};
FORMS.quote = async (d, form) => { const id = form.dataset.id, p = splitParty(d.party); const rec = Object.assign({}, id ? byId("quotes", id) : {}, { leadId: d.leadId, companyId: p.companyId, memberId: p.memberId, date: d.date, validUntil: d.validUntil, status: d.status, notes: d.notes, lines: readLines(form), id: id || uid("Q") }); const r = await save("quotes", rec, { form }); if (r) go("quote/" + r.id); };

function pipelineMini() {
  const open = DB.leads.filter(l => !["won", "lost"].includes(l.stage)), max = Math.max(1, ...SHARED.LEAD_STAGES.map(st => DB.leads.filter(l => l.stage === st).length));
  return `<div class="pipe-mini">${SHARED.LEAD_STAGES.filter(st => st !== "lost").map(st => { const n = DB.leads.filter(l => l.stage === st).length; return `<div class="pm-row"><span>${h(L(st))}</span>${meter(100 * n / max, st === "won" ? "teal" : "")}<b>${n}</b></div>`; }).join("")}
    <p class="muted small">${t("Open leads")}: <b>${open.length}</b> · ${t("Pipeline value")}: <b>${money(open.reduce((a, l) => a + (+l.budget || 0), 0))}</b>/${t("mo")}</p></div>`;
}

/* ===== 24-contracts.js ===== */
/* Contracts / office agreements, Ejari-ready fields, deposits, renewals and notice reminders. */
function contractTable(list) {
  return table([{ label: "Number", f: c => `<b>${h(c.number)}</b>` }, { label: "Client", f: c => h(partyName(c)) }, { label: "Spaces", f: c => h((c.spaceIds || []).map(s => (byId("spaces", s) || {}).code).join(", ")) }, { label: "Term", f: c => `${fmtD(c.start)} → ${fmtD(c.end)}` },
    { label: "Monthly", f: c => money(monthlyValue(c)), cls: "num" }, { label: "Deposit", f: c => c.deposit ? `${money(c.deposit)} ${chip(c.depositStatus)}` : "—" }, { label: "Status", f: c => chip(c.status) + (R.noticeDue(c, TODAY)[1] ? " " + chip("notice", "c-warn") : "") }],
    list.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1), { id: "tbl-ct", rowAttr: c => `data-go="contract/${c.id}" class="click"` });
}
PAGES.contracts = () => {
  const act = DB.contracts.filter(c => contractCovers(c, TODAY));
  return { title: "Contracts", html: pageHead(t("Contracts"), `${act.length} ${t("active")} · ${money(mrr())} ${t("/ month before VAT")}`, (can("contracts") ? btn(ic("plus") + t("New contract"), "ct-new", {}, "btn-primary", "btn-ct-new") : "") + btn(t("Export CSV"), "ct-csv")) +
    `<div class="card">${filterBox("tbl-ct")}${contractTable(DB.contracts)}</div>` };
};
ACT["ct-new"] = () => go("contract/new");
ACT["ct-csv"] = () => download(`contracts-${TODAY}.csv`, csv(DB.contracts, [["number", "Number"], [c => partyName(c), "Client"], [c => (c.spaceIds || []).map(s => (byId("spaces", s) || {}).code).join(" "), "Spaces"], [c => fmtD(c.start), "Start"], [c => fmtD(c.end), "End"], ["monthlyFee", "Monthly fee"], ["deposit", "Deposit"], ["depositStatus", "Deposit status"], ["noticeDays", "Notice days"], ["status", "Status"], [c => (c.ejari || {}).contractNo || "", "Ejari contract no."]]), "text/csv");

const EJARI_FIELDS = [["contractNo", "Ejari contract no. (after you register)"], ["unitNo", "Unit / office no."], ["plotNo", "Plot no."], ["makani", "Makani no."], ["dewaPremise", "DEWA premise no."], ["landlordName", "Landlord / operator name"], ["propertyUsage", "Property usage"], ["annualRent", "Annual rent"]];
PAGES.contract = arg => {
  const isNew = arg.startsWith("new"), qs = new URLSearchParams(arg.split("?")[1] || "");
  const c = isNew ? { status: "draft", start: TODAY, end: R.addDays(R.addMonths(TODAY, 12), -1), noticeDays: 60, termMonths: 12, spaceIds: qs.get("space") ? [qs.get("space")] : [], addons: [], deposit: 0, title: "", ejari: {} } : byId("contracts", arg);
  if (!c) return empty(t("Contract not found."));
  if (isNew && qs.get("party")) Object.assign(c, splitParty(qs.get("party")));
  if (isNew && c.spaceIds.length) { const s = byId("spaces", c.spaceIds[0]); if (s) { c.monthlyFee = s.priceMonth || 0; c.title = L(s.type); } }
  const ro = !can("contracts") || (!isNew && ["ended", "renewed", "cancelled"].includes(c.status));
  const assignable = DB.spaces.filter(s => SHARED.ASSIGNABLE.includes(s.type) || s.type === "hot_desk");
  const [nd, inwin] = isNew ? ["", false] : R.noticeDue(c, TODAY), ej = c.ejari || {}, isAE = (cfg().country || "AE") === "AE";
  const invs = isNew ? [] : DB.invoices.filter(i => (i.contractIds || []).includes(c.id) || i.contractId === c.id);
  return { title: isNew ? "New contract" : c.number, html: pageHead(isNew ? t("New contract") : `${t("Contract")} ${c.number}`, isNew ? t("Office, desk, virtual office, parking or locker agreement.") : `${chip(c.status)} ${h(partyName(c))}${inwin ? ` · <span class="warn-t">${t("Notice due by")} ${fmtD(nd)}</span>` : ""}`,
    isNew ? "" : btn(ic("print") + t("Print summary"), "print-doc", { kind: "contract", id: c.id }) + (canAct("renew_contract") && ["active", "notice"].includes(c.status) ? btn(t("Renew"), "ct-renew", { id: c.id }, "btn-primary", "btn-ct-renew") : "") + (can("contracts") && ["active", "notice"].includes(c.status) ? btn(t("End contract"), "ct-end", { id: c.id }, "btn-danger-ghost") : "")) +
    `<form data-form="contract" data-id="${h(isNew ? "" : c.id)}" class="grid-form card" id="contract-form">
      <h3 class="wide">${t("Agreement")}</h3>
      ${fld(t("Client"), `<select name="party" required ${ro ? "disabled" : ""}><option value="">${t("— choose —")}</option>${partyOptions(partyKeyOf(c))}</select>`, { req: true })}${fld(t("Title on invoices"), inp("title", c.title, `placeholder="${t("e.g. Private office")}" ${ro ? "disabled" : ""}`))}
      ${fld(t("Spaces"), `<select name="spaceIds" multiple size="5" ${ro ? "disabled" : ""}>${assignable.map(s => `<option value="${s.id}" ${(c.spaceIds || []).includes(s.id) ? "selected" : ""}>${h(s.code)} · ${h(s.name)} (${L(spaceState(s))})</option>`).join("")}</select>`, { hint: t("Ctrl/Cmd-click to choose more than one") })}
      <div class="grid-sub">${fld(t("Start date"), dateInp("start", c.start, `required ${ro ? "disabled" : ""}`), { req: true })}${fld(t("End date"), dateInp("end", c.end, `required ${ro ? "disabled" : ""}`), { req: true })}${fld(t("Status"), selInp("status", SHARED.CONTRACT_STATUS.map(x => [x, L(x)]), c.status, undefined, ro ? "disabled" : ""))}</div>
      ${fld(t("Monthly fee (example)"), numInp("monthlyFee", c.monthlyFee, `required ${ro ? "disabled" : ""}`), { req: true, hint: t("before VAT; first and last months are prorated by day") })}${fld(t("Notice period (days)"), numInp("noticeDays", c.noticeDays, ro ? "disabled" : ""))}
      ${fld(t("Security deposit"), numInp("deposit", c.deposit, ro ? "disabled" : ""))}${fld(t("Deposit status"), selInp("depositStatus", ["not_due", "due", "received", "refunded", "part_refunded"].map(x => [x, L(x)]), c.depositStatus || "due", undefined, can("contracts") ? "" : "disabled"))}
      ${fld(t("Renewal term (months)"), numInp("termMonths", c.termMonths, ro ? "disabled" : ""))}<label class="fld check"><input type="checkbox" name="vatExempt" ${c.vatExempt ? "checked" : ""} ${ro ? "disabled" : ""}><span>${t("Zero-rated / outside VAT (ask your tax adviser)")}</span></label>
      <h3 class="wide">${t("Monthly add-ons")}</h3><div class="wide lines" id="addons">${(c.addons || []).concat(ro ? [] : [{}]).map((a, i) => addonRow(a, i, ro)).join("")}</div>${ro ? "" : `<div class="wide">${btn(ic("plus") + t("Add line"), "addon-add", {}, "btn-ghost btn-sm")}</div>`}
      ${isAE ? `<h3 class="wide">${t("Ejari-ready fields")} <span class="tag">${t("for your registration")}</span></h3><p class="hint wide">${t("Kept so you can register the tenancy on the official Ejari system yourself. Immora BCS does not connect to or register with Ejari.")}</p>
      ${EJARI_FIELDS.map(([k, l]) => fld(t(l), inp("ej_" + k, ej[k], ro && k !== "contractNo" ? "disabled" : ""))).join("")}` : ""}
      ${fld(t("Notes"), txt("notes", c.notes, ro ? "disabled" : ""), { wide: true })}
      <div class="form-foot wide">${!isNew && can("contracts") && ["draft", "cancelled"].includes(c.status) ? btn(t("Delete"), "ct-del", { id: c.id }, "btn-danger-ghost") : ""}${can("contracts") ? `<button class="btn btn-primary" id="btn-ct-save">${isNew ? t("Create contract") : t("Save")}</button>` : ""}</div></form>
    ${!isNew ? `<div class="grid-2 r12"><div class="card"><h3>${t("Renewal & notice")}</h3><dl class="dl"><dt>${t("Ends")}</dt><dd>${fmtD(c.end)} (${R.daysBetween(TODAY, c.end)} ${t("days")})</dd><dt>${t("Notice by")}</dt><dd>${fmtD(nd)}</dd><dt>${t("Reminder sent")}</dt><dd>${c.noticeReminded ? fmtD(c.noticeReminded) : "—"}</dd>${c.renewedFrom ? `<dt>${t("Renews")}</dt><dd>${link((byId("contracts", c.renewedFrom) || {}).number || "", "contract/" + c.renewedFrom)}</dd>` : ""}${c.renewedTo ? `<dt>${t("Renewed as")}</dt><dd>${link((byId("contracts", c.renewedTo) || {}).number || "", "contract/" + c.renewedTo)}</dd>` : ""}</dl></div>
      <div class="card"><h3>${t("Invoices")}</h3>${invoiceTable(invs)}</div></div>` : ""}` };
};
const addonRow = (a, i, ro) => `<div class="line-row addon"><input name="ad_name[]" placeholder="${t("e.g. Parking bay, call answering")}" value="${h(a.name || "")}" ${ro ? "disabled" : ""} list="dl-products"><input name="ad_qty[]" data-type="num" value="${h(a.qty === undefined ? 1 : a.qty)}" ${ro ? "disabled" : ""} aria-label="${t("Qty")}"><input name="ad_price[]" data-type="num" value="${h(a.price === undefined ? "" : a.price)}" placeholder="${t("Price / month")}" ${ro ? "disabled" : ""} aria-label="${t("Price")}"></div>${i === 0 ? `<datalist id="dl-products">${DB.products.map(p => `<option value="${h(p.name)}">`).join("")}</datalist>` : ""}`;
ACT["addon-add"] = () => $("#addons").insertAdjacentHTML("beforeend", addonRow({}, 1));
FORMS.contract = async (d, form) => {
  const id = form.dataset.id, old = id ? byId("contracts", id) : {}, p = splitParty(d.party || partyKeyOf(old));
  const ej = Object.assign({}, old.ejari || {}); EJARI_FIELDS.forEach(([k]) => { if (("ej_" + k) in d) ej[k] = d["ej_" + k]; });
  const addons = (d.ad_name || []).map((n, i) => ({ name: n, qty: d.ad_qty[i] === "" ? 1 : d.ad_qty[i], price: d.ad_price[i] === "" ? 0 : d.ad_price[i] })).filter(a => a.name);
  const sp = form.spaceIds ? Array.from(form.spaceIds.selectedOptions).map(o => o.value) : old.spaceIds;
  const rec = Object.assign({}, old, { companyId: p.companyId, memberId: p.memberId, title: d.title, spaceIds: sp, start: d.start || old.start, end: d.end || old.end, status: d.status || old.status, monthlyFee: d.monthlyFee === undefined ? old.monthlyFee : d.monthlyFee,
    noticeDays: d.noticeDays === undefined ? old.noticeDays : d.noticeDays, deposit: d.deposit === undefined ? old.deposit : d.deposit, depositStatus: d.depositStatus || old.depositStatus, termMonths: d.termMonths || old.termMonths || 12, vatExempt: !!d.vatExempt, addons: form.querySelector("[name='ad_name[]']") ? addons : old.addons, ejari: ej, notes: d.notes === undefined ? old.notes : d.notes, id: id || uid("CT") });
  const r = await save("contracts", rec, { form, msg: id ? t("Contract saved") : t("Contract created") }); if (r) go("contract/" + r.id);
};
ACT["ct-renew"] = el => { const c = byId("contracts", el.dataset.id); const s = R.addDays(c.end, 1);
  modal(t("Renew contract"), `<form data-form="renew" data-id="${c.id}" class="grid-form"><p class="wide">${t("Creates a new contract from")} <b>${fmtD(s)}</b> ${t("for")} ${c.termMonths || 12} ${t("months and marks this one as renewed.")}</p>${fld(t("Price change %"), numInp("uplift", 0), { hint: t("e.g. 5 for +5%. Check any rent-increase rules that apply to you.") })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-renew-go">${t("Renew")}</button></div></form>`); };
FORMS.renew = async (d, form) => { const r = await act("renew_contract", { id: form.dataset.id, uplift: d.uplift || 0 }, t("Contract renewed")); if (r) { closeModal(); go("contract/" + r.id); } };
ACT["ct-end"] = async el => { const c = byId("contracts", el.dataset.id); const day = await promptBox(t("End contract"), t("Last day (DD-MM-YYYY)"), fmtD(c.end)); if (!day) return; const iso = parseD(day); if (!iso) return toast(t("Use DD-MM-YYYY"), "err"); if (await save("contracts", Object.assign({}, c, { end: iso, status: iso < TODAY ? "ended" : "notice", depositStatus: c.depositStatus }), { msg: t("Contract updated") })) render(); };
ACT["ct-del"] = async el => { if (await confirmBox(t("Delete this draft contract?"), t("Delete"), true) && await remove("contracts", el.dataset.id)) go("contracts"); };

PAGES.renewals = () => {
  const due = noticeList(), soon = DB.contracts.filter(c => ["active", "notice"].includes(c.status) && c.end <= R.addDays(TODAY, 120)).sort((a, b) => a.end < b.end ? -1 : 1);
  const deps = DB.contracts.filter(c => c.deposit && ["due"].includes(c.depositStatus));
  return { title: "Renewals & notices", html: pageHead(t("Renewals & notices"), t("Contracts in their notice window get a reminder (simulated email in the Outbox) with one click."), canAct("notice_reminders") ? btn(ic("bell") + t("Queue notice reminders"), "notice-run", {}, "btn-primary", "btn-notice-run") : "") +
    `<div class="kpis">${kpi(t("In notice window"), due.length, `${t("reminder")} ${SHARED.NOTICE_WINDOW_DAYS} ${t("days before the notice date")}`, "bell", due.length ? "amber" : "green")}${kpi(t("Ending in 120 days"), soon.length, money(sum(soon, monthlyValue)) + " " + t("/ month at risk"), "file", "blue")}${kpi(t("Deposits to collect"), deps.length, money(sum(deps, c => c.deposit)), "receipt", deps.length ? "red" : "green")}</div>
    <div class="card"><h3>${t("Ending soon")}</h3>${table([{ label: "Number", f: c => link(c.number, "contract/" + c.id) }, { label: "Client", f: c => h(partyName(c)) }, { label: "Ends", f: c => fmtD(c.end) }, { label: "Notice by", f: c => { const [n, w] = R.noticeDue(c, TODAY); return `${fmtD(n)} ${w ? chip("notice", "c-warn") : ""}`; } }, { label: "Reminder", f: c => c.noticeReminded ? `${t("sent")} ${fmtD(c.noticeReminded)}` : "—" }, { label: "Monthly", f: c => money(monthlyValue(c)), cls: "num" }, { label: "", f: c => canAct("renew_contract") ? btn(t("Renew"), "ct-renew", { id: c.id }, "btn-ghost btn-sm") : "" }], soon)}</div>
    <div class="card"><h3>${t("Deposits")}</h3>${table([{ label: "Number", f: c => link(c.number, "contract/" + c.id) }, { label: "Client", f: c => h(partyName(c)) }, { label: "Deposit", f: c => money(c.deposit), cls: "num" }, { label: "Status", f: c => chip(c.depositStatus) }, { label: "", f: c => can("contracts") && c.depositStatus === "due" ? btn(t("Mark received"), "dep-recv", { id: c.id }, "btn-ghost btn-sm") : "" }], DB.contracts.filter(c => c.deposit && ["active", "notice", "draft"].includes(c.status)))}</div>` };
};
ACT["notice-run"] = async () => { const r = await act("notice_reminders", {}, x => `${x.created} ${t("reminder(s) queued in the Outbox (simulated)")}`); if (r) render(); };
ACT["dep-recv"] = async el => { const c = byId("contracts", el.dataset.id); if (await save("contracts", Object.assign({}, c, { depositStatus: "received" }), { msg: t("Deposit marked received") })) render(); };

/* ===== 25-vo.js ===== */
/* Virtual office: business address use on trade licences, mail handling log, call answering notes. */
PAGES.addressuse = () => ({ title: "Business address use", html: pageHead(t("Business address use"), t("Companies using the centre's address on their trade licence. Keep the licence details and dates here."), can("addressuse") ? btn(ic("plus") + t("Add company"), "au-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "Company", f: a => link((byId("companies", a.companyId) || {}).legalName || "—", "company/" + a.companyId) }, { label: "Trade licence", k: "licenceNo" }, { label: "Authority", k: "authority" }, { label: "Address used", k: "addressText" }, { label: "From", f: a => fmtD(a.from) }, { label: "To", f: a => fmtD(a.to) || "—" },
    { label: "Licence expiry", f: a => { const e = (byId("companies", a.companyId) || {}).licenceExpiry; return e ? fmtD(e) + (e <= R.addDays(TODAY, 45) ? " " + chip("due", "c-warn") : "") : "—"; } }, { label: "Status", f: a => chip(a.status) }], DB.addressuse, { rowAttr: a => can("addressuse") ? `data-act="au-edit" data-id="${a.id}" class="click"` : "" })}</div>
  <div class="card"><h3>${t("Virtual office clients")}</h3>${contractTable(DB.contracts.filter(c => (c.spaceIds || []).some(s => (byId("spaces", s) || {}).type === "virtual_office")))}</div>` });
ACT["au-new"] = () => auModal(); ACT["au-edit"] = el => auModal(el.dataset.id);
function auModal(id) {
  const a = id ? byId("addressuse", id) : { from: TODAY, status: "active", addressText: cfg().address };
  modal(id ? t("Business address use") : t("Add company"), `<form data-form="au" data-id="${h(id || "")}" class="grid-form">${fld(t("Company"), selInp("companyId", DB.companies.map(c => [c.id, c.legalName]), a.companyId, t("— choose —"), "required"), { req: true, wide: true })}
    ${fld(t("Trade licence no."), inp("licenceNo", a.licenceNo, "required"), { req: true })}${fld(t("Licensing authority"), inp("authority", a.authority))}${fld(t("Address as written on the licence"), inp("addressText", a.addressText), { wide: true })}
    ${fld(t("From"), dateInp("from", a.from))}${fld(t("To"), dateInp("to", a.to))}${fld(t("Status"), selInp("status", ["active", "ended"].map(x => [x, L(x)]), a.status))}${fld(t("Notes"), inp("notes", a.notes))}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.au = async (d, form) => { const id = form.dataset.id; if (await save("addressuse", Object.assign({}, id ? byId("addressuse", id) : {}, d, { id: id || uid("AU") }), { form })) { closeModal(); render(); } };

PAGES.mail = () => {
  const rows = DB.mail.slice().sort((a, b) => a.received < b.received ? 1 : -1);
  return { title: "Mail log", html: pageHead(t("Mail log"), t("Every letter and parcel received for members and virtual-office clients. One click to notify, mark collected, forwarded or scanned."), (can("mail") ? btn(ic("plus") + t("Log mail"), "mail-new", {}, "btn-primary", "btn-mail-new") : "") + btn(t("Export CSV"), "mail-csv")) +
    `<div class="minis">${SHARED.MAIL_STATUS.map(s => `<div class="mini"><b>${DB.mail.filter(m => m.status === s).length}</b><span>${L(s)}</span></div>`).join("")}</div>
    <div class="card">${filterBox("tbl-mail")}${table([{ label: "Received", f: m => fmtD(m.received) }, { label: "For", f: m => h(partyName(m)) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "Tracking", k: "tracking" }, { label: "Status", f: m => chip(m.status) },
      { label: "", f: m => can("mail") ? mailButtons(m) : "" }], rows, { id: "tbl-mail" })}</div>` };
};
const mailButtons = m => ({ received: [["notified", "Notify"]], notified: [["collected", "Collected"], ["scanned", "Scanned"], ["forwarded", "Forwarded"]] }[m.status] || []).map(([s, l]) => btn(t(l), "mail-status", { id: m.id, s }, "btn-ghost btn-sm")).join("");
ACT["mail-csv"] = () => download(`mail-${TODAY}.csv`, csv(DB.mail, [[m => fmtD(m.received), "Received"], [m => partyName(m), "For"], ["type", "Type"], ["sender", "From"], ["tracking", "Tracking"], ["status", "Status"], ["notes", "Notes"]]), "text/csv");
ACT["mail-new"] = () => mailModal();
function mailModal() {
  modal(t("Log mail"), `<form data-form="mail" class="grid-form">${fld(t("For"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions("")}</select>`, { req: true, wide: true })}
    ${fld(t("Type"), selInp("type", SHARED.MAIL_TYPES.map(x => [x, L(x)]), "letter"))}${fld(t("From (sender)"), inp("sender", "", "required"), { req: true })}${fld(t("Tracking no."), inp("tracking", ""))}${fld(t("Received"), dateInp("received", TODAY))}
    ${fld(t("Notes"), inp("notes", ""), { wide: true })}<label class="fld check wide"><input type="checkbox" name="notify" checked><span>${t("Notify the client now (simulated email in the Outbox)")}</span></label><div class="form-foot wide"><button class="btn btn-primary" id="btn-mail-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.mail = async (d, form) => {
  const p = splitParty(d.party), rec = { id: uid("ML"), companyId: p.companyId, memberId: p.memberId, type: d.type, sender: d.sender, tracking: d.tracking, received: d.received || TODAY, notes: d.notes, status: d.notify ? "notified" : "received" };
  const r = await save("mail", rec, { form, msg: t("Mail logged") }); if (!r) return;
  if (d.notify) await notifyMail(r);
  closeModal(); render();
};
async function notifyMail(m) { const to = m.companyId ? (byId("companies", m.companyId) || {}).email : (byId("members", m.memberId) || {}).email; if (can("outbox")) await save("outbox", { id: uid("OUT"), to: to || partyName(m), subject: `${t("Mail for you")}: ${L(m.type)} ${t("from")} ${m.sender}`, body: `${L(m.type)} ${t("from")} ${m.sender} ${t("received on")} ${fmtD(m.received)}. ${t("Please collect it from reception.")}`, status: "queued", date: TODAY, kind: "mail" }, { toast: false }); }
ACT["mail-status"] = async el => { const m = byId("mail", el.dataset.id); const r = await save("mail", Object.assign({}, m, { status: el.dataset.s, [el.dataset.s + "On"]: TODAY }), { msg: `${t("Mail")}: ${L(el.dataset.s)}` }); if (r) { if (el.dataset.s === "notified") await notifyMail(r); render(); } };

PAGES.calls = () => ({ title: "Call answering", html: pageHead(t("Call answering"), t("Messages taken for virtual-office and member companies."), can("calls") ? btn(ic("plus") + t("Log a call"), "call-new", {}, "btn-primary") : "") +
  `<div class="card">${table([{ label: "When", f: c => fmtDT(c.when) }, { label: "For", f: c => h(partyName(c)) }, { label: "Caller", k: "caller" }, { label: "Number", k: "phone" }, { label: "Message", k: "message" }, { label: "Status", f: c => chip(c.status) },
    { label: "", f: c => can("calls") && c.status !== "closed" ? btn(c.status === "new" ? t("Passed on") : t("Close"), "call-status", { id: c.id, s: c.status === "new" ? "passed_on" : "closed" }, "btn-ghost btn-sm") : "" }], DB.calls.slice().sort((a, b) => a.when < b.when ? 1 : -1))}</div>` });
ACT["call-new"] = () => callModal();
function callModal() {
  modal(t("Log a call"), `<form data-form="call" class="grid-form">${fld(t("For"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions("")}</select>`, { req: true, wide: true })}${fld(t("Caller name"), inp("caller", "", "required"), { req: true })}${fld(t("Call-back number"), inp("phone", "", 'type="tel"'))}
    ${fld(t("Message"), txt("message", "", "required"), { req: true, wide: true })}<div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.call = async (d, form) => { const p = splitParty(d.party); if (await save("calls", { id: uid("CL"), companyId: p.companyId, memberId: p.memberId, caller: d.caller, phone: d.phone, message: d.message, status: "new", when: `${TODAY}T${NOW}` }, { form, msg: t("Call logged") })) { closeModal(); render(); } };
ACT["call-status"] = async el => { const c = byId("calls", el.dataset.id); if (await save("calls", Object.assign({}, c, { status: el.dataset.s }))) render(); };

/* ===== 26-billing.js ===== */
/* Billing: invoices, billing run with prorations, charges/add-ons, receipts, credit notes, dunning, payment links, Books export. */
function linesEditor(lines, ro) {
  const rate = cfg().vatRate === undefined ? 5 : cfg().vatRate;
  return `<div class="lines" id="lines"><div class="line-row head"><span>${t("Description")}</span><span>${t("Qty")}</span><span>${t("Unit price")}</span><span>${cfg().vatName || "VAT"} %</span><span>${t("Amount")}</span><span></span></div>
    ${(lines && lines.length ? lines : [{ qty: 1, price: 0, vat: rate }]).map(l => lineRow(l, ro, rate)).join("")}</div>
    ${ro ? "" : `<div class="lines-tools">${btn(ic("plus") + t("Add line"), "line-add", {}, "btn-ghost btn-sm")}<select data-live="line-product" aria-label="${t("Add an add-on")}"><option value="">${t("+ add-on / product…")}</option>${DB.products.map(p => `<option value="${p.id}">${h(p.name)} · ${money(p.price)}</option>`).join("")}</select></div>`}
    <div class="totals" id="totals"></div>`;
}
const lineRow = (l, ro, rate) => `<div class="line-row"><input name="ln_desc[]" value="${h(l.desc || "")}" placeholder="${t("Description")}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Description")}"><input name="ln_qty[]" data-type="num" value="${h(l.qty === undefined ? 1 : l.qty)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Qty")}"><input name="ln_price[]" data-type="num" value="${h(l.price === undefined ? "" : l.price)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="${t("Unit price")}"><input name="ln_vat[]" data-type="num" value="${h(l.vat === undefined ? rate : l.vat)}" ${ro ? "disabled" : ""} data-live="totals" aria-label="VAT %"><span class="ln-amt num">${money(R.r2((l.qty === undefined ? 1 : l.qty) * (l.price || 0)), false)}</span>${ro ? "<span></span>" : `<button type="button" class="btn-icon sm" data-act="line-del" aria-label="${t("Remove line")}">${ic("x")}</button>`}</div>`;
function readLines(form) {
  const ds = $$("[name='ln_desc[]']", form), q = $$("[name='ln_qty[]']", form), p = $$("[name='ln_price[]']", form), v = $$("[name='ln_vat[]']", form);
  return ds.map((d, i) => ({ desc: d.value.trim(), qty: Number(String(q[i].value).replace(/,/g, "")) || 0, price: Number(String(p[i].value).replace(/,/g, "")) || 0, vat: v[i].value === "" ? 0 : Number(v[i].value) })).filter(l => l.desc || l.price);
}
LIVE.totals = () => {
  const f = $("#lines"); if (!f) return; const rows = $$(".line-row:not(.head)", f);
  let sub = 0, vat = 0; rows.forEach(r => { const [d, q, p, v] = $$("input", r).map(x => x.value); const net = R.r2((Number(q) || 0) * (Number(String(p).replace(/,/g, "")) || 0)); sub += net; vat += R.r2(net * (Number(v) || 0) / 100); $(".ln-amt", r).textContent = money(net, false); });
  $("#totals").innerHTML = `<div><span>${t("Subtotal")}</span><b>${money(R.r2(sub))}</b></div><div><span>${cfg().vatName || "VAT"}</span><b>${money(R.r2(vat))}</b></div><div class="grand"><span>${t("Total")}</span><b>${money(R.r2(sub + vat))}</b></div>`;
};
ACT["line-add"] = () => { $("#lines").insertAdjacentHTML("beforeend", lineRow({ qty: 1 }, false, cfg().vatRate)); LIVE.totals(); };
ACT["line-del"] = el => { el.closest(".line-row").remove(); LIVE.totals(); };
LIVE["line-product"] = el => { const p = byId("products", el.value); if (!p) return; $("#lines").insertAdjacentHTML("beforeend", lineRow({ desc: p.name, qty: 1, price: p.price }, false, cfg().vatRate)); el.value = ""; LIVE.totals(); };
AFTER.invoice = () => LIVE.totals(); AFTER.quote = () => LIVE.totals();

function invoiceTable(list, o) {
  o = o || {};
  return table([{ label: "Number", f: i => i.number ? `<b>${h(i.number)}</b>` : `<i class="hint">${t("Draft")}</i>` }, { label: "Date", f: i => fmtD(i.date) }, { label: "Client", f: i => h((i.customer || {}).name || partyName(i)) }, { label: "Due", f: i => fmtD(i.dueDate) + (["issued", "part_paid"].includes(i.status) && i.dueDate < TODAY ? ` <small class="bad-t">${R.daysBetween(i.dueDate, TODAY)}d</small>` : "") },
    { label: "Total", f: i => money(i.total), cls: "num" }, { label: "Balance", f: i => i.status === "draft" || i.status === "void" ? "—" : money(invBal(i)), cls: "num" }, { label: "Status", f: i => chip(i.status) + (i.dunningLevel ? ` <small class="bad-t">R${i.dunningLevel}</small>` : "") }],
    list, { id: o.id, rowAttr: i => `data-go="invoice/${i.id}" class="click"`, empty: t("No invoices yet.") });
}
let INV_FILTER = "all";
PAGES.invoices = () => {
  const f = { all: () => true, draft: i => i.status === "draft", open: i => ["issued", "part_paid"].includes(i.status), overdue: i => ["issued", "part_paid"].includes(i.status) && i.dueDate < TODAY, paid: i => i.status === "paid", void: i => i.status === "void" };
  const rows = DB.invoices.filter(f[INV_FILTER]).sort((a, b) => (a.status === "draft") !== (b.status === "draft") ? (a.status === "draft" ? -1 : 1) : ((a.number || "") < (b.number || "") ? 1 : -1));
  const drafts = DB.invoices.filter(i => i.status === "draft");
  return { title: "Invoices", html: pageHead(t("Invoices"), `${t("Open balance")} ${money(sum(openInvoices(), invBal))} · ${t("overdue")} ${money(sum(overdue(), invBal))}`,
    (can("invoices") && drafts.length ? btn(ic("check") + `${t("Issue all drafts")} (${drafts.length})`, "inv-issue-all", {}, "btn-ghost", "btn-issue-all") : "") + (can("invoices") ? btn(ic("plus") + t("New invoice"), "inv-new", {}, "btn-primary", "btn-inv-new") : "") + btn(t("Export CSV"), "inv-csv")) +
    `<div class="seg">${Object.keys(f).map(k => `<button class="${INV_FILTER === k ? "on" : ""}" data-act="inv-filter" data-f="${k}">${t({ all: "All", draft: "Drafts", open: "Unpaid", overdue: "Overdue", paid: "Paid", void: "Void" }[k])} <small>${DB.invoices.filter(f[k]).length}</small></button>`).join("")}</div>
    <div class="card">${filterBox("tbl-inv")}${invoiceTable(rows, { id: "tbl-inv" })}</div>` };
};
ACT["inv-filter"] = el => { INV_FILTER = el.dataset.f; render(); };
ACT["inv-new"] = () => go("invoice/new");
ACT["inv-csv"] = () => download(`invoices-${TODAY}.csv`, csv(DB.invoices.filter(i => i.number), [["number", "Number"], [i => fmtD(i.date), "Date"], [i => fmtD(i.dueDate), "Due"], [i => (i.customer || {}).name, "Customer"], [i => (i.customer || {}).trn, "Customer TRN"], ["subtotal", "Subtotal"], ["vatTotal", "VAT"], ["total", "Total"], ["paid", "Paid"], [i => invBal(i), "Balance"], ["status", "Status"]]), "text/csv");
ACT["inv-issue-all"] = async () => {
  const drafts = DB.invoices.filter(i => i.status === "draft").sort((a, b) => a.date < b.date ? -1 : 1);
  if (!(await confirmBox(`${t("Issue")} ${drafts.length} ${t("draft invoices? Numbers are given in order and issued tax invoices cannot be edited.")}`, t("Issue all")))) return;
  if (await saveMany(drafts.map(i => ["invoices", Object.assign({}, i, { status: "issued" })]), `${drafts.length} ${t("invoices issued")}`)) render();
};
PAGES.invoice = arg => {
  const isNew = arg.startsWith("new"); const i = isNew ? { status: "draft", date: TODAY, lines: [], companyId: "", memberId: "" } : byId("invoices", arg);
  if (!i) return empty(t("Invoice not found."));
  if (i.status !== "draft") return invoiceView(i);
  const ro = !can("invoices");
  return { title: isNew ? "New invoice" : t("Draft invoice"), html: pageHead(isNew ? t("New invoice") : t("Draft invoice"), t("A draft has no number yet. Issuing gives the next tax invoice number and locks it."), !isNew ? btn(ic("print") + t("Preview"), "print-doc", { kind: "invoice", id: i.id }) : "") +
    `<form data-form="invoice" data-id="${h(isNew ? "" : i.id)}" class="card grid-form" id="invoice-form">
      ${fld(t("Bill to"), `<select name="party" required ${ro ? "disabled" : ""}><option value="">${t("— choose —")}</option>${partyOptions(partyKeyOf(i))}</select>`, { req: true })}${fld(t("Invoice date"), dateInp("date", i.date, ro ? "disabled" : ""))}${fld(t("Due date"), dateInp("dueDate", i.dueDate, `placeholder="${t("auto")}" ${ro ? "disabled" : ""}`), { hint: `${t("Default")}: +${cfg().paymentTermsDays || 14} ${t("days")}` })}
      ${i.periodStart ? `<p class="hint wide">${t("Billing period")}: ${fmtD(i.periodStart)} – ${fmtD(i.periodEnd)}</p>` : ""}
      <div class="wide">${linesEditor(i.lines, ro)}</div>${fld(t("Notes on invoice"), txt("notes", i.notes, ro ? "disabled" : ""), { wide: true })}
      <div class="form-foot wide">${!isNew && can("invoices") ? btn(t("Delete draft"), "inv-del", { id: i.id }, "btn-danger-ghost") : ""}${ro ? "" : `<button class="btn btn-ghost" name="mode" value="draft" id="btn-inv-draft">${t("Save draft")}</button><button class="btn btn-primary" name="mode" value="issue" id="btn-inv-issue">${t("Issue tax invoice")}</button>`}</div></form>` };
};
FORMS.invoice = async (d, form, ev) => {
  const id = form.dataset.id, old = id ? byId("invoices", id) : {}, p = splitParty(d.party), mode = (ev.submitter && ev.submitter.value) || "draft";
  if (mode === "issue" && !(await confirmBox(t("Issue this tax invoice? It gets the next number and can no longer be edited."), t("Issue")))) return;
  const rec = Object.assign({}, old, { companyId: p.companyId, memberId: p.memberId, date: d.date || TODAY, dueDate: d.dueDate || "", lines: readLines(form), notes: d.notes, status: mode === "issue" ? "issued" : "draft", id: id || uid("INV") });
  const r = await save("invoices", rec, { form, msg: mode === "issue" ? t("Tax invoice issued") : t("Draft saved") }); if (r) go("invoice/" + r.id);
};
ACT["inv-del"] = async el => { if (await confirmBox(t("Delete this draft?"), t("Delete"), true) && await remove("invoices", el.dataset.id)) go("invoices"); };
function invoiceView(i) {
  const bal = invBal(i), cns = DB.creditnotes.filter(c => c.invoiceId === i.id), rcs = DB.receipts.filter(r => r.invoiceId === i.id), open = ["issued", "part_paid"].includes(i.status);
  return { title: i.number, html: pageHead(`${(i.supplier || {}).invoiceTitle || t("Tax Invoice")} ${i.number}`, `${chip(i.status)} ${h((i.customer || {}).name || "")} · ${t("balance")} <b>${money(bal)}</b>${i.dunningLevel ? ` · ${t("reminder level")} ${i.dunningLevel}` : ""}`,
    btn(ic("print") + t("Print / PDF"), "print-doc", { kind: "invoice", id: i.id }, "btn-ghost", "btn-inv-print") + (open && can("receipts") ? btn(ic("receipt") + t("Record payment"), "inv-pay", { id: i.id }, "btn-primary", "btn-inv-pay") : "") + (open && canAct("payment_link") ? btn(ic("link") + t("Payment link"), "inv-link", { id: i.id }, "btn-ghost", "btn-inv-link") : "") +
    (open && can("creditnotes") ? btn(t("Credit note"), "inv-cn", { id: i.id }, "btn-ghost", "btn-inv-cn") : "") + (i.status === "issued" && !Number(i.paid) && can("invoices") ? btn(t("Void"), "inv-void", { id: i.id }, "btn-danger-ghost") : "")) +
    `${i.paymentLink ? `<div class="note">${ic("link")} ${t("Payment link (placeholder — no payment provider connected)")}: <code>${h(i.paymentLink)}</code></div>` : ""}${i.status === "void" ? `<div class="note bad">${t("Voided on")} ${fmtD(i.voidedOn)}: ${h(i.voidReason)}</div>` : ""}
    <div class="doc-preview">${docHTML("invoice", i)}</div>
    <div class="grid-2"><div class="card"><h3>${t("Payments")}</h3>${table([{ label: "Receipt", k: "number" }, { label: "Date", f: r => fmtD(r.date) }, { label: "Method", f: r => L(r.method) }, { label: "Amount", f: r => money(r.amount), cls: "num" }, { label: "", f: r => btn(ic("print"), "print-doc", { kind: "receipt", id: r.id }, "btn-icon sm") }], rcs, { empty: t("No payments yet.") })}</div>
    <div class="card"><h3>${t("Credit notes")}</h3>${table([{ label: "Number", k: "number" }, { label: "Date", f: c => fmtD(c.date) }, { label: "Reason", k: "reason" }, { label: "Total", f: c => money(c.total), cls: "num" }, { label: "", f: c => btn(ic("print"), "print-doc", { kind: "creditnote", id: c.id }, "btn-icon sm") }], cns, { empty: t("None.") })}</div></div>` };
}
ACT["inv-void"] = async el => { const i = byId("invoices", el.dataset.id); const why = await promptBox(t("Void invoice"), t("Reason for voiding"), ""); if (!why) return; if (await save("invoices", Object.assign({}, i, { status: "void", voidReason: why }), { msg: t("Invoice voided") })) render(); };
ACT["inv-link"] = async el => { const r = await act("payment_link", { id: el.dataset.id }, t("Payment link created (placeholder)")); if (r) render(); };
ACT["inv-pay"] = el => receiptModal(el.dataset.id);
function receiptModal(invId) {
  const list = openInvoices().filter(i => invBal(i) > 0).sort((a, b) => a.dueDate < b.dueDate ? -1 : 1), i = invId ? byId("invoices", invId) : list[0];
  modal(t("Record payment"), `<form data-form="receipt" class="grid-form">${fld(t("Invoice"), `<select name="invoiceId" required data-live="rc-inv">${opts(list.map(x => [x.id, `${x.number} · ${(x.customer || {}).name} · ${money(invBal(x))}`]), i ? i.id : "")}</select>`, { req: true, wide: true })}
    ${fld(t("Amount"), numInp("amount", i ? invBal(i) : "", "required id=rc-amt"), { req: true })}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Method"), selInp("method", SHARED.PAY_METHODS.map(x => [x, L(x)]), "bank_transfer"))}${fld(t("Reference"), inp("ref", ""))}
    <div class="form-foot wide"><button class="btn btn-primary" id="btn-rc-save">${t("Save receipt")}</button></div></form>`, { wide: true });
}
LIVE["rc-inv"] = el => { const i = byId("invoices", el.value); if (i) $("#rc-amt").value = invBal(i); };
FORMS.receipt = async (d, form) => { const r = await save("receipts", { id: uid("RC"), invoiceId: d.invoiceId, amount: d.amount, date: d.date || TODAY, method: d.method, ref: d.ref }, { form, msg: t("Payment recorded") }); if (r) { closeModal(); render(); } };
ACT["inv-cn"] = el => { const i = byId("invoices", el.dataset.id);
  modal(t("Credit note"), `<form data-form="cn" data-id="${i.id}" class="grid-form"><p class="wide">${t("For invoice")} <b>${h(i.number)}</b> · ${t("balance")} ${money(invBal(i))}</p>${fld(t("Reason"), inp("reason", "", "required"), { req: true, wide: true })}
    <div class="wide">${linesEditor([{ desc: t("Credit for") + " " + i.number, qty: 1, price: 0, vat: cfg().vatRate }])}</div><div class="form-foot wide"><button class="btn btn-primary" id="btn-cn-save">${t("Issue credit note")}</button></div></form>`, { wide: true }); LIVE.totals(); };
FORMS.cn = async (d, form) => { const r = await save("creditnotes", { id: uid("CN"), invoiceId: form.dataset.id, reason: d.reason, date: TODAY, lines: readLines(form) }, { form, msg: t("Credit note issued") }); if (r) { closeModal(); render(); } };

/* ---------------- billing run */
let BR_MONTH = null;
PAGES.billingrun = () => {
  if (!BR_MONTH) BR_MONTH = R.monthBounds(TODAY)[0];
  const [invs, , skipped] = R.billingRun(DB, BR_MONTH, TODAY, cfg());
  const total = sum(invs, i => i.total);
  return { title: "Billing run", html: pageHead(t("Billing run"), t("Creates draft invoices for every active contract (first and last months prorated by day), monthly add-ons, and pending charges such as printing, coffee, parking and extra room hours."),
    `<div class="seg"><button data-act="br-move" data-n="-1">‹</button><button class="on">${R.monthBounds(BR_MONTH).map(fmtD).join(" – ")}</button><button data-act="br-move" data-n="1">›</button></div>${canAct("billing_run") ? btn(ic("refresh") + `${t("Create")} ${invs.length} ${t("draft invoices")}`, "br-run", {}, "btn-primary", "btn-br-run") : ""}`) +
    `<div class="kpis">${kpi(t("Invoices to create"), invs.length, `${skipped.length} ${t("contracts already billed")}`, "bill", "blue")}${kpi(t("Subtotal"), money0(sum(invs, i => i.subtotal)), "", "chart", "teal")}${kpi(cfg().vatName || "VAT", money0(sum(invs, i => i.vatTotal)), `${cfg().vatRate}%`, "receipt", "violet")}${kpi(t("Total"), money0(total), "", "bill", "green")}</div>
    <div class="card"><h3>${t("Preview")}</h3>${invs.length ? `<div class="br-list">${invs.map(i => `<details class="br-item"><summary><b>${h(partyName(i))}</b><span>${i.lines.length} ${t("lines")}</span><b class="num">${money(i.total)}</b></summary>${table([{ label: "Description", k: "desc" }, { label: "Amount", f: l => money(l.net), cls: "num" }, { label: cfg().vatName || "VAT", f: l => money(l.tax), cls: "num" }], i.lines)}</details>`).join("")}</div>` : empty(t("Nothing to bill for this month — every active contract already has an invoice."))}</div>` };
};
ACT["br-move"] = el => { BR_MONTH = R.addMonths(BR_MONTH, Number(el.dataset.n)); render(); };
ACT["br-run"] = async () => { const r = await act("billing_run", { period: BR_MONTH }, x => `${x.created} ${t("draft invoices created")}`); if (r) { INV_FILTER = "draft"; go("invoices"); } };

/* ---------------- charges */
PAGES.charges = () => {
  const rows = DB.charges.slice().sort((a, b) => (!!a.invoiceId - !!b.invoiceId) || (a.date < b.date ? 1 : -1));
  return { title: "Charges & add-ons", html: pageHead(t("Charges & add-ons"), t("One-off items (printing, coffee, parking, catering, extra room hours) waiting for the next billing run."), can("charges") ? btn(ic("plus") + t("Add charge"), "charge-new", {}, "btn-primary", "btn-charge-new") : "") +
    `<div class="kpis">${kpi(t("Not invoiced yet"), money0(sum(DB.charges.filter(c => !c.invoiceId), c => c.amount)), `${DB.charges.filter(c => !c.invoiceId).length} ${t("charges")}`, "coffee", "amber")}</div>
    <div class="card">${table([{ label: "Date", f: c => fmtD(c.date) }, { label: "For", f: c => h(partyName(c)) }, { label: "Description", k: "desc" }, { label: "Qty", k: "qty", cls: "num" }, { label: "Price", f: c => money(c.price), cls: "num" }, { label: "Amount", f: c => money(c.amount), cls: "num" },
      { label: "Invoice", f: c => c.invoiceId ? link((byId("invoices", c.invoiceId) || {}).number || t("Draft"), "invoice/" + c.invoiceId) : chip("due", "c-warn") }, { label: "", f: c => !c.invoiceId && can("charges") && !c.bookingId ? btn(ic("x"), "charge-del", { id: c.id }, "btn-icon sm") : "" }], rows)}</div>` };
};
ACT["charge-new"] = () => chargeModal();
function chargeModal(o) {
  o = o || {}; const key = o.companyId ? "c:" + o.companyId : o.memberId ? "m:" + o.memberId : "";
  modal(t("Add charge"), `<form data-form="charge" class="grid-form" id="charge-form">${fld(t("Charge to"), `<select name="party" required><option value="">${t("— choose —")}</option>${partyOptions(key)}<optgroup label="${t("Members of companies")}">${DB.members.filter(m => m.companyId).map(m => `<option value="m:${m.id}" ${key === "m:" + m.id ? "selected" : ""}>${h(m.name)} (${h((byId("companies", m.companyId) || {}).legalName || "")})</option>`).join("")}</optgroup></select>`, { req: true, wide: true, hint: t("Charges for a company member go on the company's invoice.") })}
    ${fld(t("Add-on"), `<select name="productId" data-live="ch-product">${opts(DB.products.map(p => [p.id, `${p.name} · ${money(p.price)}`]), "", t("— custom —"))}</select>`)}${fld(t("Description"), inp("desc", "", "required id=ch-desc"), { req: true })}
    ${fld(t("Quantity"), numInp("qty", 1, "id=ch-qty"))}${fld(t("Unit price"), numInp("price", "", "required id=ch-price"), { req: true })}${fld(t("Date"), dateInp("date", TODAY))}<div class="form-foot wide"><button class="btn btn-primary" id="btn-charge-save">${t("Add charge")}</button></div></form>`, { wide: true });
}
LIVE["ch-product"] = el => { const p = byId("products", el.value); if (p) { $("#ch-desc").value = p.name; $("#ch-price").value = p.price; } };
FORMS.charge = async (d, form) => { const p = splitParty(d.party); const m = p.memberId ? byId("members", p.memberId) : null; if (m && m.companyId) { p.companyId = m.companyId; }
  if (await save("charges", { id: uid("CHG"), companyId: p.companyId, memberId: p.companyId ? "" : p.memberId, byMember: p.memberId, productId: d.productId, desc: d.desc + (m && m.companyId ? ` – ${m.name}` : ""), qty: d.qty === "" ? 1 : d.qty, price: d.price, date: d.date || TODAY }, { form, msg: t("Charge added") })) { closeModal(); render(); } };
ACT["charge-del"] = async el => { if (await confirmBox(t("Remove this charge?"), t("Remove"), true) && await remove("charges", el.dataset.id)) render(); };

PAGES.receipts = () => ({ title: "Receipts", html: pageHead(t("Receipts"), t("Payments received against invoices."), (can("receipts") ? btn(ic("plus") + t("Record payment"), "rc-new", {}, "btn-primary") : "") + btn(t("Export CSV"), "rc-csv")) +
  `<div class="card">${table([{ label: "Receipt", f: r => `<b>${h(r.number)}</b>` }, { label: "Date", f: r => fmtD(r.date) }, { label: "Invoice", f: r => link(r.invoiceNumber || "", "invoice/" + r.invoiceId) }, { label: "Client", k: "customerName" }, { label: "Method", f: r => L(r.method) }, { label: "Reference", k: "ref" }, { label: "Amount", f: r => money(r.amount), cls: "num" }, { label: "", f: r => btn(ic("print"), "print-doc", { kind: "receipt", id: r.id }, "btn-icon sm") }], DB.receipts.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1))}</div>` });
ACT["rc-new"] = () => receiptModal();
ACT["rc-csv"] = () => download(`receipts-${TODAY}.csv`, csv(DB.receipts, [["number", "Receipt"], [r => fmtD(r.date), "Date"], ["invoiceNumber", "Invoice"], ["customerName", "Client"], ["method", "Method"], ["ref", "Reference"], ["amount", "Amount"]]), "text/csv");
PAGES.creditnotes = () => ({ title: "Credit notes", html: pageHead(t("Credit notes"), t("Tax credit notes reduce an issued invoice. Open the invoice to issue one.")) +
  `<div class="card">${table([{ label: "Number", f: c => `<b>${h(c.number)}</b>` }, { label: "Date", f: c => fmtD(c.date) }, { label: "Invoice", f: c => link(c.invoiceNumber || "", "invoice/" + c.invoiceId) }, { label: "Client", f: c => h((c.customer || {}).name || "") }, { label: "Reason", k: "reason" }, { label: "Total", f: c => money(c.total), cls: "num" }, { label: "", f: c => btn(ic("print"), "print-doc", { kind: "creditnote", id: c.id }, "btn-icon sm") }], DB.creditnotes)}</div>` });

/* ---------------- dunning */
PAGES.dunning = () => {
  const od = overdue().sort((a, b) => a.dueDate < b.dueDate ? -1 : 1), next = R.dunningRun(DB, TODAY);
  return { title: "Overdue & reminders", html: pageHead(t("Overdue & reminders"), `${t("Reminder levels")}: 1 = ${SHARED.DUNNING_DAYS[0]}+ ${t("days")}, 2 = ${SHARED.DUNNING_DAYS[1]}+, 3 = ${SHARED.DUNNING_DAYS[2]}+ (${t("final notice")}). ${t("Reminders go to the Outbox (simulated, nothing is emailed).")}`, canAct("dunning_run") ? btn(ic("send") + `${t("Queue")} ${next.length} ${t("reminders")}`, "dun-run", {}, "btn-primary", "btn-dun-run") : "") +
    `<div class="grid-2"><div class="card"><h3>${t("Aged receivables")}</h3>${agingCard()}</div><div class="card"><h3>${t("By client")}</h3>${table([{ label: "Client", k: "name" }, { label: "Overdue", f: x => money(x.v), cls: "num" }], Object.values(od.reduce((a, i) => { const n = (i.customer || {}).name; a[n] = a[n] || { name: n, v: 0 }; a[n].v += invBal(i); return a; }, {})).sort((a, b) => b.v - a.v))}</div></div>
    <div class="card">${table([{ label: "Number", f: i => link(i.number, "invoice/" + i.id) }, { label: "Client", f: i => h((i.customer || {}).name) }, { label: "Due", f: i => fmtD(i.dueDate) }, { label: "Days overdue", f: i => R.daysBetween(i.dueDate, TODAY), cls: "num" }, { label: "Balance", f: i => money(invBal(i)), cls: "num" }, { label: "Reminder sent", f: i => i.dunningLevel ? `${t("Level")} ${i.dunningLevel} · ${fmtD(i.lastReminder)}` : "—" }, { label: "Next", f: i => { const n = next.find(x => x[0].id === i.id); return n ? chip(`L${n[1]}`, "c-warn") : "—"; } }], od, { empty: t("Nothing overdue.") })}</div>` };
};
ACT["dun-run"] = async () => { const r = await act("dunning_run", {}, x => `${x.created} ${t("reminder(s) queued in the Outbox (simulated)")}`); if (r) render(); };

/* ---------------- export to Immora Books */
PAGES.books = () => {
  const [a, b] = R.monthBounds(TODAY);
  return { title: "Export to Immora Books", html: pageHead(t("Export to Immora Books"), t("Invoices, credit notes and receipts for your accounting. Import the CSV files in Immora Books (Settings › Import data), or use the JSON file.")) +
    `<div class="card"><form data-form="books" class="grid-form">${fld(t("From"), dateInp("from", R.addMonths(a, -2)))}${fld(t("To"), dateInp("to", b))}
      <div class="form-foot wide"><button class="btn btn-ghost" name="k" value="invoices" id="btn-books-inv">${t("Invoices CSV")}</button><button class="btn btn-ghost" name="k" value="creditnotes">${t("Credit notes CSV")}</button><button class="btn btn-ghost" name="k" value="receipts" id="btn-books-rc">${t("Receipts CSV")}</button><button class="btn btn-ghost" name="k" value="customers">${t("Customers CSV")}</button><button class="btn btn-primary" name="k" value="json" id="btn-books-json">${t("Everything (JSON)")}</button></div></form>
    <p class="hint">${t("Dates are DD-MM-YYYY; amounts in")} ${h(CUR())}. ${t("Each invoice line carries its VAT rate so Immora Books can post output VAT. Drafts and void invoices are not exported.")}</p></div>` };
};
FORMS.books = (d, form, ev) => {
  const k = (ev.submitter && ev.submitter.value) || "json", from = d.from || "0000-01-01", to = d.to || "9999-12-31", inR = x => x >= from && x <= to, tag = `${fmtD(from)}_${fmtD(to)}`;
  const inv = DB.invoices.filter(i => i.number && i.status !== "void" && inR(i.date)), cns = DB.creditnotes.filter(c => inR(c.date)), rcs = DB.receipts.filter(r => inR(r.date));
  const lines = []; inv.forEach(i => i.lines.forEach((l, n) => lines.push({ i, l, n })));
  const custs = Object.values([...inv, ...cns].reduce((a, x) => { const c = x.customer || {}; a[c.name] = c; return a; }, {}));
  const sup = cfg();
  if (k === "json") { download(`immora-books-export-${tag}.json`, JSON.stringify({ source: "Immora BCS", version: APP_VERSION, supplier: { legalName: sup.legalName, trn: sup.trn, address: sup.address }, currency: CUR(), from, to, customers: custs, invoices: inv, creditNotes: cns, receipts: rcs }, null, 2), "application/json"); toast(`${inv.length} ${t("invoices")}, ${cns.length} ${t("credit notes")}, ${rcs.length} ${t("receipts")}`); return; }
  const maps = {
    invoices: [lines, [[x => x.i.number, "Invoice Number"], [x => fmtD(x.i.date), "Invoice Date"], [x => fmtD(x.i.dueDate), "Due Date"], [x => (x.i.customer || {}).name, "Customer Name"], [x => (x.i.customer || {}).trn, "Customer TRN"], [x => x.l.desc, "Item Description"], [x => x.l.qty, "Quantity"], [x => x.l.price, "Rate"], [x => x.l.vat, "Tax %"], [x => x.l.net, "Line Amount"], [x => x.l.tax, "Tax Amount"], [() => CUR(), "Currency"], [x => x.i.status, "Status"]]],
    creditnotes: [cns, [["number", "Credit Note Number"], [c => fmtD(c.date), "Date"], ["invoiceNumber", "Invoice Number"], [c => (c.customer || {}).name, "Customer Name"], ["reason", "Reason"], ["subtotal", "Subtotal"], ["vatTotal", "Tax Amount"], ["total", "Total"]]],
    receipts: [rcs, [["number", "Payment Number"], [r => fmtD(r.date), "Date"], ["invoiceNumber", "Invoice Number"], ["customerName", "Customer Name"], ["method", "Mode"], ["ref", "Reference"], ["amount", "Amount"]]],
    customers: [custs, [["name", "Customer Name"], ["trn", "TRN"], ["address", "Billing Address"], ["email", "Email"]]],
  };
  const [rows, cols] = maps[k]; download(`immora-books-${k}-${tag}.csv`, csv(rows, cols), "text/csv"); toast(`${rows.length} ${t("rows exported")}`);
};

/* ===== 27-desk.js ===== */
/* Front desk: member check-in, visitors with QR badges, access-card log (simulated reader). */
function qrSvg(text, size) {
  try { const q = qrcode(0, "M"); q.addData(text); q.make(); const n = q.getModuleCount(), s = size || 120, c = s / (n + 8); let p = "";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) p += `M${((k + 4) * c).toFixed(2)},${((r + 4) * c).toFixed(2)}h${c.toFixed(2)}v${c.toFixed(2)}h-${c.toFixed(2)}z`;
    return `<svg class="qr" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" role="img" aria-label="QR ${h(text)}"><rect width="${s}" height="${s}" fill="#fff"/><path d="${p}" fill="#000"/></svg>`; }
  catch (e) { return ""; }
}
function visitorList(vis) {
  if (!vis.length) return empty(t("No visitors expected today."), can("visitors") ? btn(t("Register visitor"), "vis-new", {}, "btn-primary btn-sm") : "");
  return `<ul class="people">${vis.map(v => `<li><span class="avatar">${h(v.name.slice(0, 1))}</span><div><b>${h(v.name)}</b><small>${t("Host")}: ${h(memberName(v.hostId))}${v.inAt ? " · " + t("in") + " " + v.inAt : ""}</small></div>${chip(v.status)}
    <div class="row-act">${can("visitors") ? (v.status === "expected" ? btn(t("Check in"), "vis-in", { id: v.id }, "btn-primary btn-sm") : v.status === "checked_in" ? btn(t("Badge"), "vis-badge", { id: v.id }, "btn-ghost btn-sm") + btn(t("Check out"), "vis-out", { id: v.id }, "btn-ghost btn-sm") : "") : ""}</div></li>`).join("")}</ul>`;
}
PAGES.checkin = () => {
  const today = DB.checkins.filter(c => c.date === TODAY).sort((a, b) => a.time < b.time ? 1 : -1), inIds = new Set(today.map(c => c.memberId));
  const act = DB.members.filter(m => m.status === "active");
  return { title: "Check-in", html: pageHead(t("Check-in"), `${today.length} ${t("members checked in today")}`, canAct("card_tap") ? btn(ic("card") + t("Card tap (simulated)"), "cardtap", {}, "btn-ghost", "btn-cardtap") : "") +
    `<div class="grid-2"><div class="card"><h3>${t("Check a member in")}</h3><form data-form="checkin" class="inline-form">${fld(t("Member"), `<select name="memberId" required>${memberOpts("")}</select>`)}<button class="btn btn-primary" id="btn-checkin">${t("Check in")}</button></form>
      <h4>${t("Not in yet")}</h4><div class="chips wrap">${act.filter(m => !inIds.has(m.id)).slice(0, 24).map(m => can("checkins") ? `<button class="chip-btn" data-act="quick-in" data-id="${m.id}">${h(m.name)}</button>` : `<span class="chip">${h(m.name)}</span>`).join("")}</div></div>
    <div class="card"><h3>${t("In today")}</h3>${table([{ label: "Time", k: "time" }, { label: "Member", f: c => link(memberName(c.memberId), "member/" + c.memberId) }, { label: "How", f: c => c.via === "card" ? t("Access card") : t("Front desk") }], today)}</div></div>
    <div class="card"><div class="card-head"><h3>${t("Visitors today")}</h3>${can("visitors") ? btn(ic("plus") + t("Register visitor"), "vis-new", {}, "btn-ghost btn-sm") : ""}</div>${visitorList(DB.visitors.filter(v => v.date === TODAY && v.status !== "cancelled"))}</div>` };
};
FORMS.checkin = async d => { if (DB.checkins.some(c => c.memberId === d.memberId && c.date === TODAY)) return toast(t("Already checked in today"), "err"); if (await save("checkins", { id: uid("CHK"), memberId: d.memberId, date: TODAY, time: NOW, via: "front_desk" }, { msg: t("Checked in") })) render(); };
ACT["quick-in"] = el => FORMS.checkin({ memberId: el.dataset.id });

PAGES.visitors = () => ({ title: "Visitors", html: pageHead(t("Visitors"), t("Pre-register guests, check them in with one click and print a QR badge."), can("visitors") ? btn(ic("plus") + t("Register visitor"), "vis-new", {}, "btn-primary", "btn-vis-new") : "") +
  `<div class="card">${filterBox("tbl-vis")}${table([{ label: "Date", f: v => fmtD(v.date) }, { label: "Visitor", f: v => `<b>${h(v.name)}</b><small class="sub-line">${h(v.company || "")}</small>` }, { label: "Host", f: v => h(memberName(v.hostId)) }, { label: "Badge", k: "number" }, { label: "In", k: "inAt" }, { label: "Out", k: "outAt" }, { label: "Status", f: v => chip(v.status) },
    { label: "", f: v => !can("visitors") ? "" : v.status === "expected" ? btn(t("Check in"), "vis-in", { id: v.id }, "btn-primary btn-sm") : v.status === "checked_in" ? btn(t("Badge"), "vis-badge", { id: v.id }, "btn-ghost btn-sm") + btn(t("Check out"), "vis-out", { id: v.id }, "btn-ghost btn-sm") : "" }], DB.visitors.slice().sort((a, b) => a.date < b.date ? 1 : -1), { id: "tbl-vis" })}</div>` });
ACT["vis-new"] = () => visitorModal();
function visitorModal() {
  modal(t("Register visitor"), `<form data-form="visitor" class="grid-form">${fld(t("Visitor name"), inp("name", "", "required"), { req: true })}${fld(t("Visitor company"), inp("company", ""))}${fld(t("Mobile"), inp("phone", "", 'type="tel"'))}
    ${fld(t("Host member"), `<select name="hostId" required>${memberOpts("")}</select>`, { req: true })}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Purpose"), inp("purpose", "Meeting"))}
    <label class="fld check wide"><input type="checkbox" name="now" checked><span>${t("Check in now and show the QR badge")}</span></label><div class="form-foot wide"><button class="btn btn-primary" id="btn-vis-save">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.visitor = async (d, form) => {
  const now = d.now && (d.date || TODAY) === TODAY;
  const r = await save("visitors", { id: uid("VS"), name: d.name, company: d.company, phone: d.phone, hostId: d.hostId, date: d.date || TODAY, purpose: d.purpose, status: now ? "checked_in" : "expected", inAt: now ? NOW : "" }, { form, msg: now ? t("Visitor checked in") : t("Visitor registered") });
  if (r) { closeModal(true); render(); if (now) badgeModal(r.id); }
};
ACT["vis-in"] = async el => { const v = byId("visitors", el.dataset.id); const r = await save("visitors", Object.assign({}, v, { status: "checked_in", inAt: NOW }), { msg: t("Visitor checked in") }); if (r) { render(); badgeModal(r.id); } };
ACT["vis-out"] = async el => { const v = byId("visitors", el.dataset.id); if (await save("visitors", Object.assign({}, v, { status: "checked_out", outAt: NOW }), { msg: t("Visitor checked out") })) render(); };
ACT["vis-badge"] = el => badgeModal(el.dataset.id);
function badgeModal(id) {
  const v = byId("visitors", id), c = cfg();
  modal(t("Visitor badge"), `<div class="badge-card" id="badge"><div class="badge-top">${h(c.tradeName || c.legalName)}</div><div class="badge-name">${h(v.name)}</div><div class="badge-co">${h(v.company || "")}</div>
    ${qrSvg(`BCS-VISITOR|${v.number}|${v.date}`, 150)}<div class="badge-meta"><b>${h(v.number)}</b> · ${fmtD(v.date)} · ${t("Host")}: ${h(memberName(v.hostId))}</div><div class="badge-foot">${t("VISITOR")}</div></div>
    <p class="hint">${t("QR badge is simulated: the code is real, but no door reader is connected.")}</p><div class="form-foot">${btn(ic("print") + t("Print badge"), "print-badge", { id }, "btn-primary")}</div>`);
}
ACT["print-badge"] = () => printHTML($("#badge").outerHTML, "badge");

PAGES.access = () => ({ title: "Access-card log", html: pageHead(t("Access-card log"), t("Simulated card reader: no real door hardware is connected. Use it to test cards, blocks and check-ins."), canAct("card_tap") ? btn(ic("card") + t("Card tap (simulated)"), "cardtap", {}, "btn-primary", "btn-cardtap") : "") +
  `<div class="card">${table([{ label: "Time", f: a => fmtDT(a.at) }, { label: "Card", k: "cardNo" }, { label: "Member", f: a => a.memberId ? link(memberName(a.memberId), "member/" + a.memberId) : "—" }, { label: "Door", k: "door" }, { label: "Result", f: a => chip(a.result) + (a.reason ? ` <small>${h(t(a.reason))}</small>` : "") }], DB.access.slice().sort((a, b) => a.at < b.at ? 1 : -1))}</div>` });
ACT.cardtap = () => cardTapModal();
function cardTapModal() {
  modal(t("Card tap (simulated)"), `<form data-form="cardtap" class="grid-form">${fld(t("Card number"), `<input name="cardNo" list="dl-cards" required id="tap-card">`, { req: true })}<datalist id="dl-cards">${DB.members.filter(m => m.cardNo).map(m => `<option value="${h(m.cardNo)}">${h(m.name)}</option>`).join("")}</datalist>
    ${fld(t("Door"), selInp("door", ["Main entrance", "Floor 12 coworking", "Floor 14 offices", "Car park"].map(x => [x, t(x)]), "Main entrance"))}<div class="form-foot wide"><button class="btn btn-primary" id="btn-tap">${t("Tap card")}</button></div><div id="tap-res" class="wide"></div></form>`);
}
FORMS.cardtap = async d => { const r = await act("card_tap", d); if (r) { $("#tap-res").innerHTML = `<div class="note ${r.result === "granted" ? "ok" : "bad"}">${ic(r.result === "granted" ? "check" : "alert")} ${L(r.result)}${r.member ? " · " + h(r.member) : ""}${r.reason ? " · " + h(t(r.reason)) : ""}</div>`; if (curRoute().name !== "dashboard") setTimeout(render, 900); } };

/* ===== 28-help.js ===== */
/* Helpdesk and maintenance tickets. */
function ticketMini(list) { return list.length ? `<ul class="alerts">${list.slice(0, 6).map(x => `<li class="${x.priority === "high" || x.priority === "urgent" ? "bad" : ""}">${ic("ticket")}<span><a href="#" data-act="tk-open" data-id="${x.id}">${h(x.number)}</a> ${h(x.subject)} · ${chip(x.status)}</span></li>`).join("")}</ul>` : empty(t("No open tickets.")); }
let TK_FILTER = "open";
PAGES.tickets = () => {
  const open = ["open", "in_progress", "waiting"], rows = DB.tickets.filter(x => TK_FILTER === "all" || (TK_FILTER === "open" ? open.includes(x.status) : !open.includes(x.status))).sort((a, b) => (PRI[b.priority] - PRI[a.priority]) || (a.opened < b.opened ? 1 : -1));
  return { title: "Tickets", html: pageHead(t("Tickets"), t("Maintenance, IT, cleaning and billing requests from members and staff."), `<div class="seg">${[["open", "Open"], ["done", "Resolved"], ["all", "All"]].map(([k, l]) => `<button class="${TK_FILTER === k ? "on" : ""}" data-act="tk-filter" data-f="${k}">${t(l)}</button>`).join("")}</div>${can("tickets") ? btn(ic("plus") + t("New ticket"), "tk-new", {}, "btn-primary", "btn-tk-new") : ""}`) +
    `<div class="card">${table([{ label: "No.", f: x => `<b>${h(x.number)}</b>` }, { label: "Subject", k: "subject" }, { label: "Category", f: x => L(x.category === "maintenance" ? "maintenance_c" : x.category) }, { label: "Priority", f: x => chip(x.priority, "p-" + x.priority) }, { label: "From", f: x => x.memberId ? h(memberName(x.memberId)) : t("Staff") }, { label: "Opened", f: x => fmtD(x.opened) }, { label: "Assigned", k: "assignee" }, { label: "Status", f: x => chip(x.status) }], rows, { rowAttr: x => `data-act="tk-open" data-id="${x.id}" class="click"` })}</div>` };
};
const PRI = { low: 0, normal: 1, high: 2, urgent: 3 };
ACT["tk-filter"] = el => { TK_FILTER = el.dataset.f; render(); };
ACT["tk-new"] = () => ticketModal(); ACT["tk-open"] = el => ticketModal(el.dataset.id);
function ticketModal(id) {
  const x = id ? byId("tickets", id) : { status: "open", priority: "normal", category: "maintenance" }, ro = !can("tickets");
  modal(id ? `${x.number} · ${x.subject}` : t("New ticket"), `<form data-form="ticket" data-id="${h(id || "")}" class="grid-form">${fld(t("Subject"), inp("subject", x.subject, `required ${ro ? "disabled" : ""}`), { req: true, wide: true })}
    ${fld(t("Category"), selInp("category", SHARED.TICKET_CATS.map(c => [c, L(c === "maintenance" ? "maintenance_c" : c)]), x.category, undefined, ro ? "disabled" : ""))}${fld(t("Priority"), selInp("priority", SHARED.PRIORITIES.map(c => [c, L(c)]), x.priority, undefined, ro ? "disabled" : ""))}
    ${fld(t("Raised by member"), `<select name="memberId" ${ro ? "disabled" : ""}>${memberOpts(x.memberId, t("— staff —"))}</select>`)}${fld(t("Assigned to"), selInp("assignee", ["frontdesk", "community", "finance", "admin", "Facilities contractor"], x.assignee, "—", ro ? "disabled" : ""))}
    ${fld(t("Status"), selInp("status", SHARED.TICKET_STATUS.map(c => [c, L(c)]), x.status, undefined, ro ? "disabled" : ""))}${fld(t("Location / space"), inp("location", x.location, ro ? "disabled" : ""))}
    ${fld(t("Description"), txt("description", x.description, ro ? "disabled" : ""), { wide: true })}
    ${id ? `<div class="wide"><h4>${t("Updates")}</h4>${(x.comments || []).length ? `<ul class="comments">${x.comments.map(c => `<li><b>${h(c.by)}</b> <small>${fmtD(c.at)}</small><p>${h(c.text)}</p></li>`).join("")}</ul>` : `<p class="hint">${t("No updates yet.")}</p>`}${ro ? "" : fld(t("Add an update"), txt("comment", ""), { wide: true })}</div>` : ""}
    <div class="form-foot wide">${ro ? "" : `<button class="btn btn-primary" id="btn-tk-save">${t("Save")}</button>`}</div></form>`, { wide: true });
}
FORMS.ticket = async (d, form) => { const id = form.dataset.id, old = id ? byId("tickets", id) : {}; const comments = (old.comments || []).slice(); if (d.comment) comments.push({ by: ME.username, at: TODAY, text: d.comment }); delete d.comment;
  if (await save("tickets", Object.assign({}, old, d, { comments, id: id || uid("TK") }), { form })) { closeModal(); render(); } };

/* ===== 29-reports.js ===== */
/* Reports with charts and CSV export: occupancy, revenue, churn, aged receivables, room utilisation. */
let REP_TAB = "occupancy";
const months = n => Array.from({ length: n }, (_, k) => R.addMonths(R.monthBounds(TODAY)[0], k - n + 1));
function occByMonth(n) {
  return months(n).map(ms => { const mid = R.addDays(ms, 14), [, me] = R.monthBounds(ms), day = mid > TODAY && ms <= TODAY ? TODAY : mid;
    const row = { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}` };
    for (const ty of ["private_office", "dedicated_desk"]) { const sp = DB.spaces.filter(s => s.type === ty); const occ = sp.filter(s => DB.contracts.some(c => (c.spaceIds || []).includes(s.id) && ["active", "notice", "renewed", "ended"].includes(c.status) && c.start <= day && c.end >= day)).length; row[ty] = sp.length ? Math.round(100 * occ / sp.length) : 0; }
    return row; });
}
function revenueSplit(n) {
  return months(n).map(ms => { const [a, b] = R.monthBounds(ms), row = { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, fee: 0, addon: 0, charge: 0, other: 0 };
    DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= a && i.date <= b).forEach(i => i.lines.forEach(l => { row[["fee", "addon", "charge"].includes(l.kind) ? l.kind : "other"] += l.net; }));
    DB.creditnotes.filter(c => c.date >= a && c.date <= b).forEach(c => row.other -= c.subtotal);
    for (const k of ["fee", "addon", "charge", "other"]) row[k] = R.r2(row[k]); return row; });
}
function churnByMonth(n) {
  return months(n).map(ms => { const [a, b] = R.monthBounds(ms); const live = c => !["draft", "cancelled"].includes(c.status);
    const activeStart = DB.contracts.filter(c => live(c) && c.start < a && c.end >= a).length;
    const ended = DB.contracts.filter(c => live(c) && c.end >= a && c.end <= b && c.status !== "renewed" && !DB.contracts.some(x => x.renewedFrom === c.id)).length;
    const started = DB.contracts.filter(c => live(c) && c.start >= a && c.start <= b && !c.renewedFrom).length;
    return { label: `${ms.slice(5, 7)}-${ms.slice(2, 4)}`, month: ms, activeStart, started, ended, rate: activeStart ? Math.round(1000 * ended / activeStart) / 10 : 0 }; });
}
function roomUtil(days) {
  const c = cfg(), open = (hm2m(c.openTo || "22:00") - hm2m(c.openFrom || "07:00")) / 60, from = R.addDays(TODAY, -days + 1);
  return roomList().map(s => { const hrs = sum(DB.bookings.filter(b => b.spaceId === s.id && b.status !== "cancelled" && b.start.slice(0, 10) >= from && b.start.slice(0, 10) <= TODAY), b => R.hoursBetween(b.start, b.end)); return { label: s.name, hours: R.r2(hrs), value: Math.round(100 * hrs / (open * days)) }; });
}
PAGES.reports = () => {
  const tabs = [["occupancy", "Occupancy"], ["revenue", "Revenue"], ["churn", "Churn"], ["receivables", "Aged receivables"], ["rooms", "Room use"]];
  let body = "";
  if (REP_TAB === "occupancy") { const o = occByMonth(6), now = ["private_office", "dedicated_desk", "hot_desk", "parking", "locker"].map(ty => ({ ty, ...occupancy([ty]) }));
    body = `<div class="kpis">${now.map(x => kpi(L(x.ty), pct(x.pct), `${x.occ}/${x.total - x.maint}${x.maint ? ` · ${x.maint} ${t("in maintenance")}` : ""}`, "building", "blue", meter(x.pct))).join("")}</div>
      <div class="card"><h3>${t("Occupancy by month (mid-month, % of spaces under contract)")}</h3>${stackChart(o.map(r => ({ label: r.label, a: r.private_office, b: r.dedicated_desk })), [["a", L("private_office") + " %", "c1"], ["b", L("dedicated_desk") + " %", "c2"]], { fmt: v => Math.round(v) })}</div>`; }
  if (REP_TAB === "revenue") { const r = revenueSplit(6), top = Object.values(DB.invoices.filter(i => i.number && i.status !== "void" && i.date >= R.addMonths(R.monthBounds(TODAY)[0], -5)).reduce((a, i) => { const n = (i.customer || {}).name; a[n] = a[n] || { name: n, v: 0 }; a[n].v += i.subtotal; return a; }, {})).sort((a, b) => b.v - a.v).slice(0, 10);
    body = `<div class="kpis">${kpi(t("This month (invoiced, before VAT)"), money0(sum(Object.values(r[5]).filter(v => typeof v === "number"))), "", "chart", "green")}${kpi(t("Last 6 months"), money0(sum(r, x => x.fee + x.addon + x.charge + x.other)), "", "chart", "blue")}${kpi(t("Monthly recurring revenue"), money0(mrr()), t("active contracts"), "refresh", "teal")}</div>
      <div class="card"><h3>${t("Revenue by month and type (before VAT)")}</h3>${stackChart(r, [["fee", t("Membership & office fees"), "c1"], ["addon", t("Monthly add-ons"), "c2"], ["charge", t("Charges (printing, coffee, rooms…)"), "c3"], ["other", t("Other / credits"), "c4"]], { fmt: v => Math.round(v / 1000) + "k" })}</div>
      <div class="card"><h3>${t("Top clients (6 months)")}</h3>${table([{ label: "Client", k: "name" }, { label: "Invoiced before VAT", f: x => money(x.v), cls: "num" }], top)}</div>`; }
  if (REP_TAB === "churn") { const c = churnByMonth(6);
    body = `<div class="kpis">${kpi(t("Average monthly churn"), (sum(c, x => x.rate) / c.length).toFixed(1) + "%", t("contracts ending without renewal"), "users", "amber")}${kpi(t("New contracts (6 months)"), sum(c, x => x.started), "", "plus", "green")}${kpi(t("Ended (6 months)"), sum(c, x => x.ended), "", "x", "red")}</div>
      <div class="card"><h3>${t("New vs ended contracts")}</h3>${stackChart(c.map(x => ({ label: x.label, s: x.started, e: x.ended })), [["s", t("New"), "c2"], ["e", t("Ended"), "c5"]], { fmt: v => Math.round(v) })}</div>
      <div class="card">${table([{ label: "Month", k: "label" }, { label: "Active at start", k: "activeStart", cls: "num" }, { label: "New", k: "started", cls: "num" }, { label: "Ended", k: "ended", cls: "num" }, { label: "Churn %", f: x => x.rate + "%", cls: "num" }], c)}</div>`; }
  if (REP_TAB === "receivables") { const rows = Object.values(openInvoices().reduce((a, i) => { const n = (i.customer || {}).name, b = invBal(i), d = R.daysBetween(i.dueDate, TODAY); if (b <= 0) return a; a[n] = a[n] || { name: n, cur: 0, d30: 0, d60: 0, d90: 0, d90p: 0, total: 0 }; a[n][d <= 0 ? "cur" : d <= 30 ? "d30" : d <= 60 ? "d60" : d <= 90 ? "d90" : "d90p"] += b; a[n].total += b; return a; }, {})).sort((a, b) => b.total - a.total);
    body = `<div class="card"><h3>${t("Aged receivables")}</h3>${agingCard()}</div><div class="card">${table([{ label: "Client", k: "name" }, { label: "Current", f: x => money(x.cur, false), cls: "num" }, { label: "1–30 days", f: x => money(x.d30, false), cls: "num" }, { label: "31–60 days", f: x => money(x.d60, false), cls: "num" }, { label: "61–90 days", f: x => money(x.d90, false), cls: "num" }, { label: "90+ days", f: x => money(x.d90p, false), cls: "num" }, { label: "Total", f: x => `<b>${money(x.total)}</b>`, cls: "num" }], rows, { id: "tbl-aging" })}</div>`; }
  if (REP_TAB === "rooms") { const u = roomUtil(30);
    body = `<div class="card"><h3>${t("Meeting-room use, last 30 days (% of opening hours)")}</h3>${barChart(u, { fmt: v => Math.round(v) + "%" })}</div><div class="card">${table([{ label: "Room", k: "label" }, { label: "Hours booked", k: "hours", cls: "num" }, { label: "Use %", f: x => x.value + "%", cls: "num" }], u)}</div>`; }
  return { title: "Reports", html: pageHead(t("Reports"), t("Live from your data. Export any report to CSV."), btn(ic("download") + t("Export CSV"), "rep-csv", {}, "btn-ghost", "btn-rep-csv")) +
    `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="tab ${REP_TAB === k ? "on" : ""}" data-act="rep-tab" data-t="${k}" id="rep-${k}">${t(l)}</button>`).join("")}</div><div id="report">${body}</div>` };
};
ACT["rep-tab"] = el => { REP_TAB = el.dataset.t; render(); };
ACT["rep-csv"] = () => {
  const m = {
    occupancy: () => csv(occByMonth(6), [["label", "Month"], ["private_office", "Private offices %"], ["dedicated_desk", "Dedicated desks %"]]),
    revenue: () => csv(revenueSplit(6), [["label", "Month"], ["fee", "Fees"], ["addon", "Add-ons"], ["charge", "Charges"], ["other", "Other / credits"]]),
    churn: () => csv(churnByMonth(6), [["label", "Month"], ["activeStart", "Active at start"], ["started", "New"], ["ended", "Ended"], ["rate", "Churn %"]]),
    receivables: () => csv(openInvoices().filter(i => invBal(i) > 0), [["number", "Invoice"], [i => (i.customer || {}).name, "Client"], [i => fmtD(i.dueDate), "Due"], [i => R.daysBetween(i.dueDate, TODAY), "Days overdue"], [i => invBal(i), "Balance"]]),
    rooms: () => csv(roomUtil(30), [["label", "Room"], ["hours", "Hours booked"], ["value", "Use %"]]),
  };
  download(`report-${REP_TAB}-${TODAY}.csv`, m[REP_TAB](), "text/csv"); toast(t("Report exported"));
};

/* ===== 30-admin.js ===== */
/* Centre settings (country presets), users, outbox, audit trail, backup. */
PAGES.settings = () => {
  const c = cfg();
  return { title: "Centre settings", html: pageHead(t("Centre settings"), t("Your company details print on every tax invoice. The Immora logo never appears on your documents.")) +
    `<form data-form="settings" class="card grid-form" id="settings-form"><h3 class="wide">${t("Country preset")}</h3>
      ${fld(t("Country"), `<select name="country" data-live="preset">${Object.values(SHARED.COUNTRY_PRESETS).map(p => `<option value="${p.country}" ${p.country === c.country ? "selected" : ""}>${h(t(p.countryName))}</option>`).join("")}</select>`, { hint: t("Sets currency, VAT rate, tax ID label and invoice title. Check the rules with your tax adviser.") })}
      ${fld(t("Currency"), inp("currency", c.currency, "maxlength=3"))}${fld(t("VAT / tax rate %"), numInp("vatRate", c.vatRate))}${fld(t("Tax ID label"), inp("taxLabel", c.taxLabel))}${fld(t("Invoice title"), inp("invoiceTitle", c.invoiceTitle))}${fld(t("Tax ID digits (0 = any)"), numInp("taxIdDigits", c.taxIdDigits))}
      <h3 class="wide">${t("Your company (printed on invoices)")}</h3>
      ${fld(t("Legal name"), inp("legalName", c.legalName, "required"), { req: true, wide: true })}${fld(t("Trading name"), inp("tradeName", c.tradeName))}${fld(c.taxLabel || "TRN", inp("trn", c.trn))}${fld(t("Trade licence no."), inp("licenceNo", c.licenceNo))}
      ${fld(t("Phone"), inp("phone", c.phone))}${fld(t("Email"), inp("email", c.email, 'type="email"'))}${fld(t("Address"), txt("address", c.address), { wide: true })}${fld(t("Bank details"), txt("bank", c.bank), { wide: true })}
      ${fld(t("Payment terms (days)"), numInp("paymentTermsDays", c.paymentTermsDays))}${fld(t("Opening time"), `<select name="openFrom">${timeOpts(c.openFrom || "07:00", 0, 23)}</select>`)}${fld(t("Closing time"), `<select name="openTo">${timeOpts(c.openTo || "22:00", 1, 24)}</select>`)}${fld(t("Invoice footer"), inp("footer", c.footer), { wide: true })}
      ${fld(t("Your logo (optional)"), `<input type="file" accept="image/png,image/jpeg" data-live="img" data-k="logo">`, { hint: c.logo ? t("Logo uploaded") : t("PNG or JPG, shown on your invoices") })}${fld(t("Company stamp (optional)"), `<input type="file" accept="image/png,image/jpeg" data-live="img" data-k="stamp">`, { hint: c.stamp ? t("Stamp uploaded") : "" })}
      <div class="form-foot wide">${c.logo ? btn(t("Remove logo"), "rm-img", { k: "logo" }, "btn-ghost") : ""}<button class="btn btn-primary" id="btn-settings-save">${t("Save settings")}</button></div></form>` };
};
LIVE.preset = el => { const p = SHARED.COUNTRY_PRESETS[el.value], f = $("#settings-form"); for (const k of ["currency", "vatRate", "taxLabel", "invoiceTitle", "taxIdDigits"]) f[k].value = p[k]; toast(t("Preset applied — press Save")); };
LIVE.img = async el => { const f = el.files[0]; if (!f) return; if (f.size > 400000) return toast(t("Image too large (max 400 KB)"), "err"); const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); }); if (await save("cfg", Object.assign({}, cfg(), { [el.dataset.k]: url }), { msg: t("Image saved") })) render(); };
ACT["rm-img"] = async el => { const c = Object.assign({}, cfg()); delete c[el.dataset.k]; if (await save("cfg", c)) render(); };
FORMS.settings = async (d, form) => { const p = SHARED.COUNTRY_PRESETS[d.country]; const rec = Object.assign({}, cfg(), d, { id: "centre", ejari: p.ejari, tz: p.tz, vatName: p.vatName, countryName: p.countryName }); if (await save("cfg", rec, { form, msg: t("Settings saved") })) render(); };

let USERS = null;
PAGES.users = () => {
  if (!USERS) { Backend.users().then(u => { USERS = u; render(); }).catch(fail); return { title: "Users & logins", html: `<div class="card skeleton">${t("Loading…")}</div>` }; }
  const u = USERS; USERS = null;
  return { title: "Users & logins", html: pageHead(t("Users & logins"), t("Staff roles control what each person can change. Members sign in on the member portal tab."), btn(ic("plus") + t("Add user"), "user-new", {}, "btn-primary", "btn-user-new")) +
    `<div class="card">${table([{ label: "Username", f: x => `<b>${h(x.username)}</b>` }, { label: "Name", k: "name" }, { label: "Role", f: x => L(x.role) }, { label: "Member", f: x => x.memberId ? h(memberName(x.memberId)) : "—" }, { label: "Status", f: x => chip(x.active ? "active" : "paused") }], u, { rowAttr: x => `data-act="user-edit" data-u="${h(JSON.stringify(x))}" class="click"` })}</div>
    <div class="card"><h3>${t("What each role can do")}</h3>${table([{ label: "Role", f: r => L(r) }, { label: "Can change", f: r => h((SHARED.WRITE[r] || []).join(", ") || t("nothing (read-only)")) }], SHARED.ROLES.concat(["member"]))}</div>` };
};
ACT["user-new"] = () => userModal({ role: "frontdesk", isNew: true, active: 1 });
ACT["user-edit"] = el => userModal(JSON.parse(el.dataset.u));
function userModal(u) {
  modal(u.isNew ? t("Add user") : u.username, `<form data-form="user" class="grid-form">${fld(t("Username"), inp("username", u.username, `required ${u.isNew ? "" : "readonly"}`), { req: true })}${fld(t("Name"), inp("name", u.name))}
    ${fld(t("Role"), selInp("role", SHARED.ROLES.concat(["member"]).map(r => [r, L(r)]), u.role))}${fld(t("Member (portal logins)"), `<select name="memberId">${memberOpts(u.memberId, "—")}</select>`)}
    ${fld(u.isNew ? t("Password") : t("New password (leave empty to keep)"), `<input type="password" name="password" autocomplete="new-password" ${u.isNew ? "required" : ""} minlength="8">`, { hint: t("At least 8 characters") })}<label class="fld check"><input type="checkbox" name="active" ${u.active === undefined || u.active ? "checked" : ""}><span>${t("Active")}</span></label>
    <div class="form-foot wide"><button class="btn btn-primary">${t("Save")}</button></div></form>`, { wide: true });
}
FORMS.user = async (d, form) => { try { await Backend.saveUser(d); closeModal(); toast(t("User saved")); if (curRoute().name === "users") render(); } catch (e) { fail(e, form); } };

PAGES.outbox = () => ({ title: "Outbox (simulated)", html: pageHead(t("Outbox (simulated)"), t("Reminders, mail notices and other messages are queued here. Nothing is emailed: connecting an email service is a separate step.")) +
  `<div class="card">${table([{ label: "Date", f: o => fmtD(o.date) }, { label: "To", k: "to" }, { label: "Subject", k: "subject" }, { label: "Type", k: "kind" }, { label: "Status", f: o => chip(o.status) }, { label: "", f: o => btn(t("View"), "ob-view", { id: o.id }, "btn-ghost btn-sm") + (o.status === "queued" && can("outbox") ? btn(t("Mark sent (simulated)"), "ob-sent", { id: o.id }, "btn-ghost btn-sm") : "") }], DB.outbox.slice().sort((a, b) => a.date < b.date ? 1 : -1))}</div>` });
ACT["ob-view"] = el => { const o = byId("outbox", el.dataset.id); modal(o.subject, `<p class="hint">${t("To")}: ${h(o.to)} · ${fmtD(o.date)} · ${chip(o.status)}</p><pre class="mail-body">${h(o.body || "")}</pre>`); };
ACT["ob-sent"] = async el => { const o = byId("outbox", el.dataset.id); if (await save("outbox", Object.assign({}, o, { status: "sent_simulated" }))) render(); };

let AUDIT = null;
PAGES.audit = () => {
  if (!AUDIT) { Backend.audit().then(a => { AUDIT = a; render(); }).catch(fail); return { title: "Audit trail", html: `<div class="card skeleton">${t("Loading…")}</div>` }; }
  const a = AUDIT; AUDIT = null;
  return { title: "Audit trail", html: pageHead(t("Audit trail"), t("Every sign-in, change, billing run and export, newest first.")) + `<div class="card">${filterBox("tbl-audit")}${table([{ label: "When", f: x => fmtDT(String(x.ts).replace(" ", "T")) }, { label: "User", k: "username" }, { label: "Action", k: "action" }, { label: "List", k: "coll" }, { label: "Record", k: "summary" }], a, { id: "tbl-audit" })}</div>` };
};
PAGES.backup = () => ({ title: "Backup & restore", html: pageHead(t("Backup & restore"), BUILD_MODE === "offline" ? t("The offline edition keeps data in this browser only. Download a backup regularly.") : t("Download a full copy of your data, or restore one.")) +
  `<div class="grid-2"><div class="card"><h3>${t("Download backup")}</h3><p class="hint">${t("A JSON file with all records (no passwords).")}</p>${btn(ic("download") + t("Download backup"), "backup", {}, "btn-primary", "btn-backup")}</div>
   <div class="card"><h3>${t("Restore")}</h3><p class="hint">${t("Replaces all current data with the backup file.")}</p><input type="file" accept="application/json" data-live="restore" id="restore-file"></div></div>` });
ACT.backup = async () => { try { download(`immora-bcs-backup-${TODAY}.json`, await Backend.backup(), "application/json"); toast(t("Backup downloaded")); } catch (e) { fail(e); } };
LIVE.restore = async el => { const f = el.files[0]; if (!f) return; let obj; try { obj = JSON.parse(await f.text()); } catch (e) { return toast(t("This is not an Immora BCS backup file"), "err"); } if (!(await confirmBox(t("Replace ALL current data with this backup?"), t("Restore"), true))) return; try { await Backend.restore(obj); await refresh(); toast(t("Backup restored")); } catch (e) { fail(e); } };

/* ===== 31-portal.js ===== */
/* Member portal: book rooms with credits, see invoices, raise requests, invite guests, see mail. */
const meMember = () => byId("members", ME.memberId) || {};
PAGES["p-home"] = () => {
  const m = meMember(), left = R.creditsLeft(m, TODAY, DB.bookings, DB.plans), allow = R.allowance(m, DB.plans);
  const up = DB.bookings.filter(b => b.memberId === m.id && b.status !== "cancelled" && b.end >= `${TODAY}T${NOW}`).sort((a, b) => a.start < b.start ? -1 : 1).slice(0, 5);
  const unpaid = DB.invoices.filter(i => ["issued", "part_paid"].includes(i.status) && invBal(i) > 0), mail = DB.mail.filter(x => ["received", "notified"].includes(x.status));
  const c = cfg();
  return { title: "Home", html: `<div class="hero portal-hero"><div><h2>${t("Welcome")}, ${h((m.name || "").split(" ")[0])}</h2><p class="sub">${h(c.tradeName || c.legalName)} · ${fmtD(TODAY)}</p></div></div>
    <div class="quick-grid" id="portal-actions"><button class="quick" data-act="quick" data-k="p-book">${ic("cal")}<span>${t("Book a room")}</span></button><button class="quick" data-act="quick" data-k="p-ticket-new">${ic("ticket")}<span>${t("Raise a request")}</span></button><button class="quick" data-act="quick" data-k="p-guest-new">${ic("qr")}<span>${t("Invite a guest")}</span></button><a class="quick" href="#/p-invoices">${ic("bill")}<span>${t("My invoices")}</span></a></div>
    <div class="kpis">${kpi(t("Room credits left"), `${left} / ${allow}`, t("this month"), "cal", "violet", meter(allow ? 100 * left / allow : 0))}${kpi(t("Upcoming bookings"), up.length, "", "file", "blue")}${kpi(t("To pay"), money(sum(unpaid, invBal)), `${unpaid.length} ${t("invoices")}`, "bill", unpaid.length ? "amber" : "green")}${kpi(t("Mail waiting"), mail.length, t("at reception"), "mail", mail.length ? "teal" : "green")}</div>
    <div class="grid-2"><div class="card"><div class="card-head"><h3>${t("My next bookings")}</h3>${link(t("Book a room"), "p-book")}</div>${up.length ? `<ul class="timeline">${up.map(b => `<li><b>${fmtD(b.start)} ${b.start.slice(11)}–${b.end.slice(11)}</b><span>${h(spaceName(b.spaceId))}</span><small>${h(b.title || "")}</small></li>`).join("")}</ul>` : empty(t("No bookings yet."))}</div>
    <div class="card"><div class="card-head"><h3>${t("Mail for me")}</h3></div>${mail.length ? `<ul class="alerts">${mail.map(x => `<li>${ic("mail")}<span>${L(x.type)} ${t("from")} ${h(x.sender)} · ${fmtD(x.received)}</span></li>`).join("")}</ul>` : empty(t("Nothing waiting."))}</div></div>` };
};
let P_DAY = null;
PAGES["p-book"] = () => {
  if (!P_DAY || P_DAY < TODAY) P_DAY = TODAY;
  const m = meMember(), left = R.creditsLeft(m, P_DAY, DB.bookings, DB.plans);
  return { title: "Book a room", html: pageHead(t("Book a room"), `${t("You have")} <b>${left}</b> ${t("credits left this month. Tap a free slot to book.")}`, `<div class="seg"><button data-act="p-move" data-n="-1" ${P_DAY <= TODAY ? "disabled" : ""}>‹</button><button class="on">${fmtD(P_DAY)}</button><button data-act="p-move" data-n="1">›</button></div>`) +
    `<div class="card cal-card" id="portal-cal">${calGrid(P_DAY, DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type)), DB.bookings, { slotAct: "p-slot", mine: b => b.memberId === m.id, label: b => b.title || t("My booking"), open: false })}</div>
    <p class="hint">${t("Your bookings are highlighted. Other members' bookings show only as Booked.")}</p>` };
};
ACT["p-move"] = el => { P_DAY = R.addDays(P_DAY, Number(el.dataset.n)); if (P_DAY < TODAY) P_DAY = TODAY; render(); };
ACT["p-slot"] = el => { const s = Math.min(hm2m(el.dataset.t) + 60, 22 * 60); portalBookModal(el.dataset.space, P_DAY, el.dataset.t, `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`); };
function portalBookModal(spaceId, day, from, to) {
  const rooms = DB.spaces.filter(s => ["meeting_room", "event_space"].includes(s.type));
  modal(t("Book a room"), `<form data-form="p-book" class="grid-form" id="booking-form"><input type="hidden" name="memberId" value="${h(ME.memberId)}">
    ${fld(t("Room"), `<select name="spaceId" data-live="bk-preview">${opts(rooms.map(s => [s.id, `${s.name} (${s.capacity} ${t("seats")})`]), spaceId)}</select>`, { wide: true })}${fld(t("Date"), dateInp("date", day, 'data-live="bk-preview"'))}
    <div class="fld-pair">${fld(t("From"), `<select name="from" data-live="bk-preview">${timeOpts(from)}</select>`)}${fld(t("To"), `<select name="to" data-live="bk-preview">${timeOpts(to)}</select>`)}</div>${fld(t("Title"), inp("title", "", `placeholder="${t("e.g. Client meeting")}"`))}${fld(t("Attendees"), numInp("attendees", 2))}
    <div class="wide" id="bk-preview"></div><div class="form-foot wide"><button class="btn btn-primary" id="btn-p-book">${t("Book")}</button></div></form>`, { wide: true });
  LIVE["bk-preview"]();
}
FORMS["p-book"] = async (d, form) => { const r = await save("bookings", { id: uid("BK"), spaceId: d.spaceId, memberId: ME.memberId, start: `${d.date}T${d.from}`, end: `${d.date}T${d.to}`, title: d.title, attendees: d.attendees || 1, status: "confirmed" }, { form, msg: t("Room booked") }); if (r) { closeModal(); render(); } };
PAGES["p-bookings"] = () => ({ title: "My bookings", html: pageHead(t("My bookings"), "", btn(ic("plus") + t("Book a room"), "quick", { k: "p-book" }, "btn-primary")) +
  `<div class="card">${table([{ label: "Date", f: b => fmtD(b.start) }, { label: "Time", f: b => `${b.start.slice(11)}–${b.end.slice(11)}` }, { label: "Room", f: b => h(spaceName(b.spaceId)) }, { label: "Title", k: "title" }, { label: "Credits", k: "creditsUsed", cls: "num" }, { label: "Extra charge", f: b => b.overageAmount ? money(b.overageAmount) : "—", cls: "num" }, { label: "Status", f: b => chip(b.status) },
    { label: "", f: b => b.status === "confirmed" && b.start > `${TODAY}T${NOW}` ? btn(t("Cancel"), "p-cancel", { id: b.id }, "btn-ghost btn-sm") : "" }], DB.bookings.filter(b => b.memberId === ME.memberId).sort((a, b) => a.start < b.start ? 1 : -1))}</div>` });
ACT["p-cancel"] = async el => { const b = byId("bookings", el.dataset.id); if (await confirmBox(t("Cancel this booking? Your credits come back."), t("Cancel booking"), true) && await save("bookings", Object.assign({}, b, { status: "cancelled" }), { msg: t("Booking cancelled") })) render(); };
PAGES["p-invoices"] = () => ({ title: "Invoices", html: pageHead(t("Invoices"), t("Tax invoices for you or your company.")) +
  `<div class="card">${table([{ label: "Number", f: i => `<b>${h(i.number)}</b>` }, { label: "Date", f: i => fmtD(i.date) }, { label: "Due", f: i => fmtD(i.dueDate) }, { label: "Total", f: i => money(i.total), cls: "num" }, { label: "Balance", f: i => money(invBal(i)), cls: "num" }, { label: "Status", f: i => chip(i.status) },
    { label: "", f: i => btn(ic("print") + t("View"), "p-inv", { id: i.id }, "btn-ghost btn-sm") + (i.paymentLink ? ` <small class="hint">${t("Pay online (placeholder)")}</small>` : "") }], DB.invoices.slice().sort((a, b) => (a.number || "") < (b.number || "") ? 1 : -1))}</div>` });
ACT["p-inv"] = el => { const i = byId("invoices", el.dataset.id); modal(i.number, `<div class="doc-preview">${docHTML("invoice", i)}</div><div class="form-foot">${btn(ic("print") + t("Print / PDF"), "print-doc", { kind: "invoice", id: i.id }, "btn-primary")}</div>`, { wide: true }); };
PAGES["p-tickets"] = () => ({ title: "Help & requests", html: pageHead(t("Help & requests"), t("Tell us about anything that needs fixing or help."), btn(ic("plus") + t("Raise a request"), "quick", { k: "p-ticket-new" }, "btn-primary", "btn-p-ticket")) +
  `<div class="card">${table([{ label: "No.", k: "number" }, { label: "Subject", k: "subject" }, { label: "Category", f: x => L(x.category === "maintenance" ? "maintenance_c" : x.category) }, { label: "Opened", f: x => fmtD(x.opened) }, { label: "Status", f: x => chip(x.status) }, { label: "Latest update", f: x => h(((x.comments || []).slice(-1)[0] || {}).text || "—") }], DB.tickets.slice().sort((a, b) => a.opened < b.opened ? 1 : -1))}</div>` });
function portalTicketModal() {
  modal(t("Raise a request"), `<form data-form="p-ticket" class="grid-form">${fld(t("What do you need?"), inp("subject", "", "required"), { req: true, wide: true })}${fld(t("Category"), selInp("category", SHARED.TICKET_CATS.map(c => [c, L(c === "maintenance" ? "maintenance_c" : c)]), "maintenance"))}${fld(t("How urgent?"), selInp("priority", ["low", "normal", "high"].map(c => [c, L(c)]), "normal"))}
    ${fld(t("Where?"), inp("location", ""))}${fld(t("Details"), txt("description", ""), { wide: true })}<div class="form-foot wide"><button class="btn btn-primary" id="btn-p-ticket-save">${t("Send request")}</button></div></form>`, { wide: true });
}
FORMS["p-ticket"] = async (d, form) => { if (await save("tickets", Object.assign({ id: uid("TK"), memberId: ME.memberId, status: "open", comments: [] }, d), { form, msg: t("Request sent") })) { closeModal(); go("p-tickets"); } };
PAGES["p-visitors"] = () => ({ title: "My guests", html: pageHead(t("My guests"), t("Pre-register guests so reception can welcome them."), btn(ic("plus") + t("Invite a guest"), "quick", { k: "p-guest-new" }, "btn-primary")) +
  `<div class="card">${table([{ label: "Date", f: v => fmtD(v.date) }, { label: "Guest", k: "name" }, { label: "Company", k: "company" }, { label: "Status", f: v => chip(v.status) }, { label: "", f: v => v.status === "expected" ? btn(t("Cancel"), "p-guest-cancel", { id: v.id }, "btn-ghost btn-sm") : "" }], DB.visitors.slice().sort((a, b) => a.date < b.date ? 1 : -1))}</div>` });
function portalGuestModal() {
  modal(t("Invite a guest"), `<form data-form="p-guest" class="grid-form">${fld(t("Guest name"), inp("name", "", "required"), { req: true })}${fld(t("Guest company"), inp("company", ""))}${fld(t("Date"), dateInp("date", TODAY))}${fld(t("Mobile"), inp("phone", ""))}<div class="form-foot wide"><button class="btn btn-primary">${t("Invite")}</button></div></form>`);
}
FORMS["p-guest"] = async (d, form) => { if (await save("visitors", Object.assign({ id: uid("VS"), hostId: ME.memberId, status: "expected", purpose: "Meeting" }, d), { form, msg: t("Guest registered — reception will check them in") })) { closeModal(); go("p-visitors"); } };
ACT["p-guest-cancel"] = async el => { const v = byId("visitors", el.dataset.id); if (await save("visitors", Object.assign({}, v, { status: "cancelled" }))) render(); };
PAGES["p-mail"] = () => ({ title: "Mail for me", html: pageHead(t("Mail for me"), t("Letters and parcels received for you or your company.")) +
  `<div class="card">${table([{ label: "Received", f: m => fmtD(m.received) }, { label: "Type", f: m => L(m.type) }, { label: "From", k: "sender" }, { label: "Status", f: m => chip(m.status) }], DB.mail.slice().sort((a, b) => a.received < b.received ? 1 : -1))}${DB.calls.length ? `<h3>${t("Messages taken for you")}</h3>${table([{ label: "When", f: c => fmtDT(c.when) }, { label: "Caller", k: "caller" }, { label: "Message", k: "message" }], DB.calls)}` : ""}</div>` });

/* ===== 32-print.js ===== */
/* Printable documents. These carry only the centre's own details (and its own logo/stamp if uploaded) — never the Immora logo. */
function docHead(sup, title, meta) {
  const c = cfg();
  return `<header class="doc-head"><div class="doc-from">${c.logo ? `<img src="${h(c.logo)}" alt="" class="doc-logo">` : ""}<div><div class="doc-legal">${h(sup.legalName || c.legalName)}</div><div>${h(sup.address || c.address || "")}</div>
      <div>${h(sup.taxLabel || c.taxLabel || "TRN")}: <b>${h(sup.trn || c.trn || "")}</b>${(sup.licenceNo || c.licenceNo) ? ` · ${t("Trade licence")}: ${h(sup.licenceNo || c.licenceNo)}` : ""}</div><div>${h([sup.phone || c.phone, sup.email || c.email].filter(Boolean).join(" · "))}</div></div></div>
    <div class="doc-title"><h1>${h(title)}</h1>${meta.map(([k, v]) => `<div><span>${h(k)}</span><b>${h(v)}</b></div>`).join("")}</div></header>`;
}
const docTo = (cust, label) => `<section class="doc-to"><small>${h(label || t("Bill to"))}</small><div class="doc-legal sm">${h(cust.name || "")}</div><div>${h(cust.address || "")}</div>${cust.trn ? `<div>${h(cfg().taxLabel || "TRN")}: <b>${h(cust.trn)}</b></div>` : ""}</section>`;
function docLines(lines, cur) {
  return `<table class="doc-lines"><thead><tr><th>#</th><th>${t("Description")}</th><th class="num">${t("Qty")}</th><th class="num">${t("Unit price")}</th><th class="num">${t("Taxable amount")}</th><th class="num">${cfg().vatName || "VAT"} %</th><th class="num">${cfg().vatName || "VAT"}</th><th class="num">${t("Total")} (${h(cur)})</th></tr></thead>
    <tbody>${lines.map((l, i) => `<tr><td>${i + 1}</td><td>${h(l.desc)}</td><td class="num">${R.fmtG(l.qty)}</td><td class="num">${money(l.price, false)}</td><td class="num">${money(l.net, false)}</td><td class="num">${R.fmtG(l.vat)}%</td><td class="num">${money(l.tax, false)}</td><td class="num">${money(R.r2(l.net + l.tax), false)}</td></tr>`).join("")}</tbody></table>`;
}
const docTotals = (d, cur, extra) => `<div class="doc-totals"><div><span>${t("Total excluding")} ${cfg().vatName || "VAT"}</span><b>${money(d.subtotal, cur)}</b></div><div><span>${t("Total")} ${cfg().vatName || "VAT"} (${R.fmtG(cfg().vatRate)}%)</span><b>${money(d.vatTotal, cur)}</b></div><div class="grand"><span>${t("Total amount due")}</span><b>${money(d.total, cur)}</b></div>${extra || ""}</div>`;
const docSign = () => `<div class="doc-sign">${cfg().stamp ? `<img src="${h(cfg().stamp)}" alt="" class="doc-stamp">` : ""}<div><span></span><small>${t("Authorised signature & stamp")}</small></div><div><span></span><small>${t("Received by")}</small></div></div>`;
function docHTML(kind, r) {
  const c = cfg(), sup = r.supplier || c, cur = sup.currency || c.currency || "AED";
  if (kind === "invoice") {
    const bal = r.status === "draft" ? r.total : invBal(r);
    return `<article class="doc">${r.status === "draft" ? `<div class="doc-water">${t("DRAFT – not a tax invoice")}</div>` : r.status === "void" ? `<div class="doc-water">${t("VOID")}</div>` : ""}
      ${docHead(sup, sup.invoiceTitle || c.invoiceTitle || "Tax Invoice", [[t("Invoice no."), r.number || t("Draft")], [t("Invoice date"), fmtD(r.date)], [t("Date of supply"), r.periodStart ? `${fmtD(r.periodStart)} – ${fmtD(r.periodEnd)}` : fmtD(r.date)], [t("Due date"), fmtD(r.dueDate)]])}
      ${docTo(r.customer || R.partySnapshot(r, DB))}${docLines(r.lines, cur)}${docTotals(r, cur, r.status !== "draft" && Number(r.paid || 0) + Number(r.credited || 0) > 0 ? `<div><span>${t("Paid / credited")}</span><b>${money(Number(r.paid || 0) + Number(r.credited || 0), cur)}</b></div><div class="grand"><span>${t("Balance due")}</span><b>${money(bal, cur)}</b></div>` : "")}
      <section class="doc-foot"><div>${c.bank ? `<b>${t("Bank details")}</b><br>${h(c.bank)}` : ""}${r.paymentLink ? `<br><b>${t("Pay online")}</b>: ${h(r.paymentLink)} <small>(${t("placeholder")})</small>` : ""}${r.notes ? `<p>${h(r.notes)}</p>` : ""}</div><div class="doc-qr">${r.number ? qrSvg(`${sup.legalName}|${sup.trn}|${r.number}|${r.date}|${r.total}|${r.vatTotal}`, 96) : ""}</div></section>${docSign()}
      <p class="doc-note">${h(c.footer || "")} ${t("Amounts in")} ${h(cur)}.</p></article>`;
  }
  if (kind === "creditnote") return `<article class="doc">${docHead(sup, "Tax Credit Note", [[t("Credit note no."), r.number], [t("Date"), fmtD(r.date)], [t("Against invoice"), r.invoiceNumber || ""]])}${docTo(r.customer || {})}<p><b>${t("Reason")}:</b> ${h(r.reason)}</p>${docLines(r.lines, cur)}${docTotals(r, cur).replace(t("Total amount due"), t("Total credit"))}${docSign()}</article>`;
  if (kind === "receipt") { const inv = byId("invoices", r.invoiceId) || {}; return `<article class="doc">${docHead(c, "Payment Receipt", [[t("Receipt no."), r.number], [t("Date"), fmtD(r.date)], [t("Invoice"), r.invoiceNumber || ""]])}${docTo(inv.customer || {}, t("Received from"))}
    <div class="doc-totals"><div><span>${t("Method")}</span><b>${L(r.method)}</b></div><div><span>${t("Reference")}</span><b>${h(r.ref || "—")}</b></div><div class="grand"><span>${t("Amount received")}</span><b>${money(r.amount, cur)}</b></div><div><span>${t("Balance remaining on invoice")}</span><b>${money(inv.id ? invBal(inv) : 0, cur)}</b></div></div>${docSign()}</article>`; }
  if (kind === "quote") { const ld = byId("leads", r.leadId); const cust = ld ? { name: ld.company || ld.name, address: "" } : R.partySnapshot(r, DB);
    return `<article class="doc">${docHead(c, "Quotation", [[t("Quote no."), r.number], [t("Date"), fmtD(r.date)], [t("Valid until"), fmtD(r.validUntil)]])}${docTo(cust, t("Prepared for"))}${docLines(r.lines, cur)}${docTotals(r, cur).replace(t("Total amount due"), t("Total"))}${r.notes ? `<p>${h(r.notes)}</p>` : ""}<p class="doc-note">${t("This quotation is not a tax invoice. Prices are valid until the date shown.")}</p></article>`; }
  if (kind === "contract") { const p = R.partySnapshot(r, DB), ej = r.ejari || {}, [nd] = R.noticeDue(r, TODAY);
    return `<article class="doc">${docHead(c, "Office Services Agreement – Summary", [[t("Contract no."), r.number], [t("Start"), fmtD(r.start)], [t("End"), fmtD(r.end)]])}${docTo(p, t("Client"))}
      <table class="doc-lines kv"><tbody><tr><th>${t("Spaces")}</th><td>${h((r.spaceIds || []).map(s => spaceName(s)).join(", "))}</td></tr><tr><th>${t("Monthly fee")}</th><td>${money(r.monthlyFee, cur)} + ${cfg().vatName || "VAT"}${r.vatExempt ? " (" + t("zero-rated") + ")" : ""}</td></tr>
      ${(r.addons || []).map(a => `<tr><th>${h(a.name)}</th><td>${R.fmtG(a.qty)} × ${money(a.price, cur)} ${t("/ month")}</td></tr>`).join("")}<tr><th>${t("Security deposit")}</th><td>${money(r.deposit, cur)} (${L(r.depositStatus)})</td></tr>
      <tr><th>${t("Notice period")}</th><td>${r.noticeDays} ${t("days")} — ${t("notice by")} ${fmtD(nd)}</td></tr><tr><th>${t("Renewal term")}</th><td>${r.termMonths || 12} ${t("months")}</td></tr></tbody></table>
      ${(c.country || "AE") === "AE" ? `<h3>${t("Ejari-ready details")}</h3><p class="doc-note">${t("For registration by the parties on the official Ejari system.")}</p><table class="doc-lines kv"><tbody>${EJARI_FIELDS.map(([k, l]) => `<tr><th>${t(l)}</th><td>${h(ej[k] === undefined || ej[k] === "" ? "—" : ej[k])}</td></tr>`).join("")}</tbody></table>` : ""}
      <div class="doc-sign"><div><span></span><small>${t("For")} ${h(c.legalName)}</small></div><div><span></span><small>${t("For")} ${h(p.name)}</small></div></div></article>`; }
  return "";
}
ACT["print-doc"] = el => { const coll = { invoice: "invoices", creditnote: "creditnotes", receipt: "receipts", quote: "quotes", contract: "contracts" }[el.dataset.kind]; const r = byId(coll, el.dataset.id); if (r) printHTML(docHTML(el.dataset.kind, r), el.dataset.kind); };
function printHTML(html, kind) {
  let root = $("#print-root"); if (root) root.remove();
  root = document.createElement("div"); root.id = "print-root"; root.className = "print-" + (kind || "doc"); root.innerHTML = html; document.body.appendChild(root);
  document.body.classList.add("printing");
  const done = () => { document.body.classList.remove("printing"); const r2 = $("#print-root"); if (r2 && !window.__keepPrint) r2.remove(); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  if (window.__noPrintDialog) return; setTimeout(() => { try { window.print(); } catch (e) { /* ignore */ } setTimeout(done, 1500); }, 60);
}

/* ===== 99-boot.js ===== */
/* Start-up. */
(async function boot() {
  let th = "light"; try { th = localStorage.getItem("immora-bcs-theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) { /* ignore */ }
  document.documentElement.dataset.theme = th;
  let l = "en"; try { l = localStorage.getItem("immora-bcs-lang") || "en"; } catch (e) { /* ignore */ }
  setLang(l);
  if (BUILD_MODE === "server") { try { window.__INFO = await (await fetch("api/info")).json(); } catch (e) { window.__INFO = {}; } }
  ME = await Backend.me();
  if (ME) { if (ME.lang) setLang(ME.lang); await start(); } else renderLogin();
  window.__ready = true;
})();
