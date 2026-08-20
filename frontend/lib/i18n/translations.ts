export type Language = "en" | "fa" | "ps";

export interface Translations {
  // Product branding
  brandName: string;
  brandTagline: string;
  brandAlt: string;

  // Navigation (Public)
  navPackages: string;
  navFeatures: string;
  navSignIn: string;
  navDashboard: string;

  // Navigation (Dashboard Sidebar & AppNavbar)
  quickSearch: string;
  searchPlaceholder: string;
  adminUser: string;
  systemAdmin: string;
  viewProfile: string;
  accountSettings: string;
  signOut: string;
  mainNavigation: string;
  menuDashboard: string;
  menuTeachers: string;
  menuClasses: string;
  menuSubjects: string;
  menuAssignments: string;
  menuTimetable: string;
  menuSettings: string;
  profile: string;
  exit: string;
  website: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroBtnPackages: string;
  heroBtnSignIn: string;

  // Packages Section
  packagesTitle: string;
  packagesSubtitle: string;
  pkgTrialName: string;
  pkgTrialDesc: string;
  pkgTrialGen: string;
  pkgTrialVal: string;
  pkgA1Name: string;
  pkgA1Badge: string;
  pkgA1Desc: string;
  pkgA1Gen: string;
  pkgA1Val: string;
  pkgA1Btn: string;
  pkgA2Name: string;
  pkgA2Badge: string;
  pkgA2Desc: string;
  pkgA2Gen: string;
  pkgA2Val: string;
  pkgA3Name: string;
  pkgA3Desc: string;
  pkgA3Gen: string;
  pkgA3Val: string;
  selectPackage: string;
  afnCurrency: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;

  // Modal Checkout
  modalTitle: string;
  modalSub: string;
  modalSchoolLabel: string;
  modalSchoolPlaceholder: string;
  modalPhoneLabel: string;
  modalPhonePlaceholder: string;
  modalPaymentLabel: string;
  modalPayHesab: string;
  modalPayHesabSub: string;
  modalPayBank: string;
  modalPayBankSub: string;
  modalConfirmBtn: string;
  modalGuarantee: string;
  modalSuccessTitle: string;
  modalSuccessSub: string;
  modalSuccessMsg: string;
  modalDoneBtn: string;

  // Login Page
  loginAuthBadge: string;
  loginReturnHome: string;
  loginTitle: string;
  loginSub: string;
  roleAdmin: string;
  rolePrincipal: string;
  roleTeacher: string;
  loginEmailLabel: string;
  loginPassLabel: string;
  loginForgotPass: string;
  loginSubmitBtn: string;
  loginDemoBtn: string;
  loginPkgCallout: string;
  loginViewPkg: string;

  // Footer
  footerTitle: string;
  footerSub: string;
  footerRights: string;
  footerSystemTitle: string;
  footerSystemDescription: string;
  footerPagesTitle: string;
  footerServicesTitle: string;
  footerCustomPackage: string;
  footerContactWhatsApp: string;
  footerBuiltBy: string;

  // Dashboard Overview Page
  dashOverview: string;
  dashWelcome: string;
  dashWelcomeMsg: string;
  dashActiveClasses: string;
  dashTeachersAssigned: string;
  statClassesTitle: string;
  statClassesDesc: string;
  statTeachersTitle: string;
  statTeachersDesc: string;
  statSubjectsTitle: string;
  statSubjectsDesc: string;
  statActive: string;

  // Quick Actions
  qaTitle: string;
  qaSub: string;
  qaViewTimetableTitle: string;
  qaViewTimetableDesc: string;
  qaAddTeacherTitle: string;
  qaAddTeacherDesc: string;
  qaAddSubjectTitle: string;
  qaAddSubjectDesc: string;
  qaAddClassTitle: string;
  qaAddClassDesc: string;
  qaAssignmentsTitle: string;
  qaAssignmentsDesc: string;
  qaGenerateTitle: string;
  qaGenerateDesc: string;

  // Teachers Page
  teachersPageBadge: string;
  teachersPageTitle: string;
  teachersPageTitleHighlight: string;
  teachersPageDesc: string;
  teachersDeleteAll: string;
  teachersAddNew: string;
  teachersSearchPlaceholder: string;
  teachersEmpty: string;
  teachersEmptyDesc: string;

  // Classes Page
  classesPageBadge: string;
  classesPageTitle: string;
  classesPageTitleHighlight: string;
  classesPageDesc: string;
  classesDeleteAll: string;
  classesAddNew: string;
  classesSearchPlaceholder: string;
  classesEmpty: string;
  classesEmptyDesc: string;

  // Subjects Page
  subjectsPageBadge: string;
  subjectsPageTitle: string;
  subjectsPageTitleHighlight: string;
  subjectsPageDesc: string;
  subjectsDeleteAll: string;
  subjectsAddNew: string;
  subjectsSearchPlaceholder: string;
  subjectsEmpty: string;
  subjectsEmptyDesc: string;

  // Assignments Page
  assignmentsPageTitle: string;
  assignmentsPageTitleHighlight: string;
  assignmentsPageDesc: string;
  assignmentsDeleteAll: string;
  assignmentsSearchPlaceholder: string;
  assignmentsEmpty: string;
  assignmentsEmptyDesc: string;
  assignmentsAddSubject: string;
  assignmentsAssignClass: string;
  assignmentsAssignedClasses: string;
  assignmentsNoClasses: string;

  // Timetable Page
  timetablePageBadge: string;
  timetablePageTitle: string;
  timetablePageTitleHighlight: string;
  timetablePageDesc: string;
  timetableSelectClass: string;
  timetableClassLabel: string;
  menuTeacherTimetable: string;
  teacherTimetablePageBadge: string;
  teacherTimetablePageTitle: string;
  teacherTimetablePageTitleHighlight: string;
  teacherTimetablePageDesc: string;
  teacherTimetableLabel: string;
  teacherTimetableSelect: string;
  teacherTimetableExport: string;

  // Modals – Add Teacher
  modalAddTeacherTitle: string;
  modalAddTeacherDesc: string;
  modalAddTeacherLabel: string;
  modalAddTeacherPlaceholder: string;
  modalAddTeacherSubmit: string;
  modalAddTeacherSubmitting: string;
  modalAddTeacherSuccess: string;
  modalAddTeacherError: string;

  // Modals – Add Class
  modalAddClassTitle: string;
  modalAddClassDesc: string;
  modalAddClassLabel: string;
  modalAddClassPlaceholder: string;
  modalAddClassSubmit: string;
  modalAddClassSubmitting: string;
  modalAddClassSuccess: string;
  modalAddClassError: string;

  // Modals – Add Subject
  modalAddSubjectTitle: string;
  modalAddSubjectDesc: string;
  modalAddSubjectLabel: string;
  modalAddSubjectPlaceholder: string;
  modalAddSubjectSubmit: string;
  modalAddSubjectSubmitting: string;
  modalAddSubjectSuccess: string;
  modalAddSubjectError: string;

  // Modals – Assign Subject to Teacher
  modalAssignSubjectTitle: string;
  modalAssignSubjectDesc: string;
  modalAssignSubjectTeacherLabel: string;
  modalAssignSubjectTeacherPlaceholder: string;
  modalAssignSubjectSubjectLabel: string;
  modalAssignSubjectSubjectPlaceholder: string;
  modalAssignSubjectPeriodsLabel: string;
  modalAssignSubjectSubmit: string;
  modalAssignSubjectSubmitting: string;
  modalAssignSubjectSuccess: string;
  modalAssignSubjectError: string;
  modalAssignSubjectValidation: string;

  // Modals – Assign Teacher to Class
  modalAssignClassTitle: string;
  modalAssignClassDesc: string;
  modalAssignClassTeacherLabel: string;
  modalAssignClassTeacherPlaceholder: string;
  modalAssignClassSubjectLabel: string;
  modalAssignClassSubjectPlaceholder: string;
  modalAssignClassSubjectFirst: string;
  modalAssignClassGroupsLabel: string;
  modalAssignClassSubmit: string;
  modalAssignClassSubmitting: string;
  modalAssignClassSuccess: string;
  modalAssignClassError: string;
  modalAssignClassValidation: string;

  // Modals – General (Edit)
  modalEditUpdateLabel: string;
  modalEditSubmit: string;
  modalEditSubmitting: string;

  // Modals – Shared
  modalCancel: string;

  // Modals – Edit Teacher / Class / Subject (in pages)
  modalEditTeacherTitle: string;
  modalEditTeacherDesc: string;
  modalEditTeacherSuccess: string;
  modalEditTeacherError: string;
  modalEditClassTitle: string;
  modalEditClassDesc: string;
  modalEditClassSuccess: string;
  modalEditClassError: string;
  modalEditSubjectTitle: string;
  modalEditSubjectDesc: string;
  modalEditSubjectSuccess: string;
  modalEditSubjectError: string;

  // Confirmation modals in pages
  confirmDeleteTeacherTitle: string;
  confirmDeleteTeacherDesc: string;
  confirmDeleteTeacherSingleSuccess: string;
  confirmDeleteTeacherSingleError: string;
  confirmDeleteAllTeachersSuccess: string;
  confirmDeleteAllTeachersError: string;
  confirmDeleteClassSingleSuccess: string;
  confirmDeleteClassSingleError: string;
  confirmDeleteAllClassesTitle: string;
  confirmDeleteAllClassesDesc: string;
  confirmDeleteAllClassesSuccess: string;
  confirmDeleteAllClassesError: string;
  confirmDeleteSubjectSingleSuccess: string;
  confirmDeleteSubjectSingleError: string;
  confirmDeleteAllSubjectsTitle: string;
  confirmDeleteAllSubjectsDesc: string;
  confirmDeleteAllSubjectsSuccess: string;
  confirmDeleteAllSubjectsError: string;
  confirmDeleteText: string;
  confirmCancelText: string;

  // Suspense loading states
  loadingTeachers: string;
  loadingClasses: string;
  loadingSubjects: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: "MaktabYar",
    brandTagline: "Smart Timetable Management System",
    brandAlt: "MaktabYar logo",

    navPackages: "Packages & Pricing",
    navFeatures: "System Features",
    navSignIn: "Sign In",
    navDashboard: "Go to Dashboard",

    quickSearch: "Quick Search",
    searchPlaceholder: "Search anything...",
    adminUser: "Admin User",
    systemAdmin: "System Administrator",
    viewProfile: "View Profile",
    accountSettings: "Account Settings",
    signOut: "Sign Out",
    mainNavigation: "Main Navigation",
    menuDashboard: "Dashboard",
    menuTeachers: "Teachers",
    menuClasses: "Classes",
    menuSubjects: "Subjects",
    menuAssignments: "Assignments",
    menuTimetable: "Timetable",
    menuSettings: "Settings",
    profile: "Profile",
    exit: "Exit",
    website: "Website",

    heroBadge: "MaktabYar",
    heroTitle1: "Automated Timetable",
    heroTitleHighlight: "Management System",
    heroDescription:
      "A modern scheduling platform designed for schools, colleges, and universities. Generate conflict-free class schedules, manage teacher assignments, and export timetables seamlessly.",
    heroBtnPackages: "View Packages (500 AFN)",
    heroBtnSignIn: "Sign In to Dashboard",

    packagesTitle: "Packages & Pricing",
    packagesSubtitle:
      "Select a suitable plan for your institution. Package A1 offers 5 timetable generations for 500 AFN.",
    pkgTrialName: "Free Trial",
    pkgTrialDesc:
      "Sample test tier for generating your first timetable schedule.",
    pkgTrialGen: "1 Time Timetable Generation",
    pkgTrialVal: "7 Days",
    pkgA1Name: "Package A1",
    pkgA1Badge: "RECOMMENDED",
    pkgA1Desc:
      "Standard package for regular semester and term timetable updates.",
    pkgA1Gen: "5 Times Timetable Generation",
    pkgA1Val: "Till 2 Months",
    pkgA1Btn: "Buy Package A1 (500 AFN)",
    pkgA2Name: "Package A2",
    pkgA2Badge: "BEST VALUE",
    pkgA2Desc: "Ideal for growing institutions with frequent schedule updates.",
    pkgA2Gen: "15 Times Timetable Generation",
    pkgA2Val: "Till 6 Months",
    pkgA3Name: "Package A3 (Unlimited)",
    pkgA3Desc: "Enterprise plan for large school networks and universities.",
    pkgA3Gen: "Unlimited Timetable Generation",
    pkgA3Val: "Till 1 Year",
    selectPackage: "Select",
    afnCurrency: "AFN",

    featuresTitle: "System Capabilities",
    featuresSubtitle:
      "Built to provide clean, error-free timetabling management.",
    feat1Title: "Conflict Detection",
    feat1Desc:
      "Prevents double booking teachers or rooms across overlapping class periods automatically.",
    feat2Title: "Teacher Workload Management",
    feat2Desc:
      "Set period quotas per teacher and customize day-off availability rules per subject.",
    feat3Title: "Export Ready",
    feat3Desc:
      "Print master schedules or export class timetables cleanly to PDF and Excel files.",

    modalTitle: "Package Checkout",
    modalSub:
      "Complete your institution details below to activate your timetable generation package.",
    modalSchoolLabel: "School / University Name",
    modalSchoolPlaceholder: "e.g., Marefat High School / Kabul University",
    modalPhoneLabel: "Contact Phone / WhatsApp Number",
    modalPhonePlaceholder: "0799 XXX XXX or WhatsApp number",
    modalPaymentLabel: "Preferred Payment Method (AFN)",
    modalPayHesab: "HesabPay / Mobile",
    modalPayHesabSub: "Direct AFN Mobile Wallet",
    modalPayBank: "Azizi / AIB Bank",
    modalPayBankSub: "Bank Account Transfer",
    modalConfirmBtn: "Confirm Order",
    modalGuarantee: "Instant Account Activation Guarantee",
    modalSuccessTitle: "Order Received!",
    modalSuccessSub: "Thank you for your order.",
    modalSuccessMsg:
      "Our agent will reach out via WhatsApp/Call to confirm payment and grant your package.",
    modalDoneBtn: "Done & Return",

    loginAuthBadge: "Authentication",
    loginReturnHome: "← Return to Home",
    loginTitle: "Sign In",
    loginSub:
      "Enter your credentials to access your timetable system dashboard.",
    roleAdmin: "Admin",
    rolePrincipal: "Principal",
    roleTeacher: "Teacher",
    loginEmailLabel: "Email / Username",
    loginPassLabel: "Password",
    loginForgotPass: "Forgot password?",
    loginSubmitBtn: "Sign In",
    loginDemoBtn: "Quick One-Click Demo Login",
    loginPkgCallout: "Package A1 (500 AFN)",
    loginViewPkg: "View Packages →",

    footerTitle: "MaktabYar",
    footerSub: "Conflict-Free Timetable Management System",
    footerRights: "MaktabYar. All rights reserved.",
    footerSystemTitle: "The System",
    footerSystemDescription: "Smart timetable management for schools, colleges, and universities.",
    footerPagesTitle: "Pages",
    footerServicesTitle: "Requests & Services",
    footerCustomPackage: "Create your own package",
    footerContactWhatsApp: "Contact us on WhatsApp",
    footerBuiltBy: "Built by Nexvin",

    dashOverview: "Overview",
    dashWelcome: "Welcome back,",
    dashWelcomeMsg:
      "Your timetable management system is running smoothly. You have",
    dashActiveClasses: "active classes and",
    dashTeachersAssigned: "teachers assigned.",
    statClassesTitle: "Total Classes",
    statClassesDesc: "Active this semester",
    statTeachersTitle: "Total Teachers",
    statTeachersDesc: "Across all departments",
    statSubjectsTitle: "Total Subjects",
    statSubjectsDesc: "Currently scheduled",
    statActive: "Active",

    qaTitle: "Quick Actions",
    qaSub: "Common tasks and operations",
    qaViewTimetableTitle: "View Timetables",
    qaViewTimetableDesc: "Access all generated schedules",
    qaAddTeacherTitle: "Add Teacher",
    qaAddTeacherDesc: "Register a new faculty member",
    qaAddSubjectTitle: "Add Subject",
    qaAddSubjectDesc: "Define a new course or subject",
    qaAddClassTitle: "Add Class",
    qaAddClassDesc: "Create a new student group",
    qaAssignmentsTitle: "Assignments",
    qaAssignmentsDesc: "Link teachers and subjects",
    qaGenerateTitle: "Generate Timetable",
    qaGenerateDesc: "Configure and run generator",

    teachersPageBadge: "Faculty Management",
    teachersPageTitle: "Teachers",
    teachersPageTitleHighlight: "Directory",
    teachersPageDesc:
      "Manage your academic staff, their profiles, and subject assignments in one place.",
    teachersDeleteAll: "Delete All",
    teachersAddNew: "Add New Teacher",
    teachersSearchPlaceholder: "Search teachers by name...",
    teachersEmpty: "No teachers found",
    teachersEmptyDesc:
      "We couldn't find any teachers matching your search criteria.",

    classesPageBadge: "Class Management",
    classesPageTitle: "Academic",
    classesPageTitleHighlight: "Classes",
    classesPageDesc:
      "Manage all school classes, their schedules, and assignments.",
    classesDeleteAll: "Delete All",
    classesAddNew: "Add New Class",
    classesSearchPlaceholder: "Search classes by name...",
    classesEmpty: "No classes found",
    classesEmptyDesc:
      "We couldn't find any classes matching your search criteria.",

    subjectsPageBadge: "Curriculum Management",
    subjectsPageTitle: "Academic",
    subjectsPageTitleHighlight: "Subjects",
    subjectsPageDesc:
      "Define and organize your school's curriculum, including core subjects and electives.",
    subjectsDeleteAll: "Delete All",
    subjectsAddNew: "Add New Subject",
    subjectsSearchPlaceholder: "Search subjects by name...",
    subjectsEmpty: "No subjects found",
    subjectsEmptyDesc:
      "We couldn't find any subjects matching your search criteria.",

    assignmentsPageTitle: "Faculty",
    assignmentsPageTitleHighlight: "Assignments",
    assignmentsPageDesc:
      "Connect teachers with their subjects and assign them to specific class groups.",
    assignmentsDeleteAll: "Delete All Assignments",
    assignmentsSearchPlaceholder: "Search faculty members...",
    assignmentsEmpty: "No faculty members found",
    assignmentsEmptyDesc:
      "We couldn't find any teachers matching your search criteria.",
    assignmentsAddSubject: "Add Subject",
    assignmentsAssignClass: "Assign to Class",
    assignmentsAssignedClasses: "Assigned Classes",
    assignmentsNoClasses: "No classes assigned for this subject.",

    timetablePageBadge: "Schedule Planner",
    timetablePageTitle: "Master",
    timetablePageTitleHighlight: "Timetable",
    timetablePageDesc:
      "Visualize and manage class schedules, period assignments, and room allocations.",
    timetableSelectClass: "Select a class group...",
    timetableClassLabel: "CLASS",
    menuTeacherTimetable: "Teacher Timetables",
    teacherTimetablePageBadge: "Faculty Schedule",
    teacherTimetablePageTitle: "Teacher",
    teacherTimetablePageTitleHighlight: "Timetables",
    teacherTimetablePageDesc:
      "View each teacher’s weekly schedule and the class they teach in every period.",
    teacherTimetableLabel: "TEACHER",
    teacherTimetableSelect: "Select a teacher...",
    teacherTimetableExport: "Export",

    // Modals – Add Teacher
    modalAddTeacherTitle: "Add New Teacher",
    modalAddTeacherDesc: "Register a new faculty member to the system.",
    modalAddTeacherLabel: "Full Name",
    modalAddTeacherPlaceholder: "e.g., Prof. John Smith",
    modalAddTeacherSubmit: "Register Teacher",
    modalAddTeacherSubmitting: "Registering...",
    modalAddTeacherSuccess: "Teacher added successfully",
    modalAddTeacherError: "Failed to add teacher",

    // Modals – Add Class
    modalAddClassTitle: "Create Class Group",
    modalAddClassDesc:
      "Define a new student group for scheduling and management.",
    modalAddClassLabel: "Class Name / Identifier",
    modalAddClassPlaceholder: "e.g., Grade 11-B (Science)",
    modalAddClassSubmit: "Create Class Group",
    modalAddClassSubmitting: "Creating Group...",
    modalAddClassSuccess: "Class group created successfully",
    modalAddClassError: "Failed to create class group",

    // Modals – Add Subject
    modalAddSubjectTitle: "Add New Subject",
    modalAddSubjectDesc: "Create a new subject and assign faculty members.",
    modalAddSubjectLabel: "Subject Name",
    modalAddSubjectPlaceholder: "e.g., Advanced Mathematics",
    modalAddSubjectSubmit: "Create Subject",
    modalAddSubjectSubmitting: "Creating...",
    modalAddSubjectSuccess: "Subject added successfully",
    modalAddSubjectError: "Failed to add subject",

    // Modals – Assign Subject to Teacher
    modalAssignSubjectTitle: "Assign Subject to Teacher",
    modalAssignSubjectDesc:
      "Link a faculty member to a specific academic subject.",
    modalAssignSubjectTeacherLabel: "Select Teacher",
    modalAssignSubjectTeacherPlaceholder: "Choose a teacher...",
    modalAssignSubjectSubjectLabel: "Select Subject",
    modalAssignSubjectSubjectPlaceholder: "Choose a subject...",
    modalAssignSubjectPeriodsLabel: "Periods Per Week",
    modalAssignSubjectSubmit: "Confirm Assignment",
    modalAssignSubjectSubmitting: "Assigning...",
    modalAssignSubjectSuccess: "Subject assigned to teacher successfully",
    modalAssignSubjectError: "Failed to assign subject",
    modalAssignSubjectValidation: "Please select both a teacher and a subject",

    // Modals – Assign Teacher to Class
    modalAssignClassTitle: "Assign Teacher to Class",
    modalAssignClassDesc:
      "Link a faculty member and their subject to student groups.",
    modalAssignClassTeacherLabel: "Faculty Member",
    modalAssignClassTeacherPlaceholder: "Select teacher",
    modalAssignClassSubjectLabel: "Subject",
    modalAssignClassSubjectPlaceholder: "Select subject",
    modalAssignClassSubjectFirst: "Select teacher first",
    modalAssignClassGroupsLabel: "Target Class Groups",
    modalAssignClassSubmit: "Confirm Assignments",
    modalAssignClassSubmitting: "Assigning...",
    modalAssignClassSuccess: "Teacher assigned to classes successfully",
    modalAssignClassError: "Failed to assign teacher to classes",
    modalAssignClassValidation:
      "Please select a teacher, a subject, and at least one class",

    // Modals – General (Edit)
    modalEditUpdateLabel: "Update Information",
    modalEditSubmit: "Save Changes",
    modalEditSubmitting: "Updating...",

    // Modals – Shared
    modalCancel: "Cancel",

    // Edit modals in pages
    modalEditTeacherTitle: "Edit Teacher",
    modalEditTeacherDesc: "Update the teacher's profile information.",
    modalEditTeacherSuccess: "Teacher updated successfully",
    modalEditTeacherError: "Failed to update teacher",
    modalEditClassTitle: "Edit Class",
    modalEditClassDesc: "Update the class name and details.",
    modalEditClassSuccess: "Class updated successfully",
    modalEditClassError: "Failed to update class",
    modalEditSubjectTitle: "Edit Subject",
    modalEditSubjectDesc: "Update the subject's name and details.",
    modalEditSubjectSuccess: "Subject updated successfully",
    modalEditSubjectError: "Failed to update subject",

    // Confirmation modals
    confirmDeleteTeacherTitle: "Delete Teacher",
    confirmDeleteTeacherDesc: "Are you sure you want to delete all teachers?",
    confirmDeleteTeacherSingleSuccess: "Teacher deleted successfully",
    confirmDeleteTeacherSingleError: "Failed to delete teacher",
    confirmDeleteAllTeachersSuccess: "All teachers deleted successfully",
    confirmDeleteAllTeachersError: "Failed to delete teachers",
    confirmDeleteClassSingleSuccess: "Class deleted successfully",
    confirmDeleteClassSingleError: "Failed to delete class",
    confirmDeleteAllClassesTitle: "Delete All Classes",
    confirmDeleteAllClassesDesc: "Are you sure you want to delete all classes?",
    confirmDeleteAllClassesSuccess: "All classes deleted successfully",
    confirmDeleteAllClassesError: "Failed to delete classes",
    confirmDeleteSubjectSingleSuccess: "Subject deleted successfully",
    confirmDeleteSubjectSingleError: "Failed to delete subject",
    confirmDeleteAllSubjectsTitle: "Delete All Subjects",
    confirmDeleteAllSubjectsDesc:
      "Are you sure you want to delete all subjects? This action cannot be undone.",
    confirmDeleteAllSubjectsSuccess: "All subjects deleted successfully",
    confirmDeleteAllSubjectsError: "Failed to delete all subjects",
    confirmDeleteText: "Delete All",
    confirmCancelText: "Cancel",

    // Suspense
    loadingTeachers: "Loading faculty members...",
    loadingClasses: "Loading classes...",
    loadingSubjects: "Loading subjects...",
  },
  fa: {
    brandName: "مکتب یار",
    brandTagline: "سیستم هوشمند مدیریت تقسیم اوقات",
    brandAlt: "لوگوی مکتب یار",

    navPackages: "پکیج‌ها و قیمت‌ها",
    navFeatures: "قابلیت‌های سیستم",
    navSignIn: "ورود به سیستم",
    navDashboard: "ورود به داشبورد",

    quickSearch: "جستجوی سریع",
    searchPlaceholder: "جستجوی هر چیزی...",
    adminUser: "مدیر سیستم",
    systemAdmin: "مدیر عمومی سیستم",
    viewProfile: "مشاهده پروفایل",
    accountSettings: "تنظیمات حساب",
    signOut: "خروج از حساب",
    mainNavigation: "منوی اصلی",
    menuDashboard: "داشبورد",
    menuTeachers: "استادان",
    menuClasses: "صنف‌ها",
    menuSubjects: "مضمون‌ها",
    menuAssignments: "تقسیم اوقات مضامین",
    menuTimetable: "تقسیم اوقات",
    menuSettings: "تنظیمات",
    profile: "پروفایل",
    exit: "خروج",
    website: "وب‌سایت",

    heroBadge: "سیستم مسلکی تقسیم اوقات",
    heroTitle1: "سیستم خودکار مدیریت",
    heroTitleHighlight: "تقسیم اوقات درسی",
    heroDescription:
      "پلتفرم مدرن زمان‌بندی درسی برای مکاتب، پوهنتون‌ها و انستیتوت‌ها. ساخت تقسیم اوقات بدون تداخل استادان، مدیریت ساعت‌های درسی و خروجی آسان.",
    heroBtnPackages: "مشاهده پکیج‌ها (۵۰۰ افغانی)",
    heroBtnSignIn: "ورود به داشبورد",

    packagesTitle: "پکیج‌ها و قیمت‌ها",
    packagesSubtitle:
      "پکیج مناسب برای نهاد تعلیمی خود را انتخاب کنید. پکیج A1 شامل ۵ بار ساخت تقسیم اوقات به قیمت ۵۰۰ افغانی می‌باشد.",
    pkgTrialName: "امتحانی رایگان",
    pkgTrialDesc: "پکیج آزمايشی برای تست و ساخت اولین تقسیم اوقات.",
    pkgTrialGen: "۱ بار ساخت تقسیم اوقات",
    pkgTrialVal: "۷ روز اعتبار",
    pkgA1Name: "پکیج A1",
    pkgA1Badge: "پیشنهادی",
    pkgA1Desc: "پکیج معیاری برای تغییرات تقسیم اوقات سمسترها و چاریک‌ها.",
    pkgA1Gen: "۵ بار ساخت تقسیم اوقات",
    pkgA1Val: "تا ۲ ماه اعتبار",
    pkgA1Btn: "خرید پکیج A1 (۵۰۰ افغانی)",
    pkgA2Name: "پکیج A2",
    pkgA2Badge: "بهترین ارزش",
    pkgA2Desc: "مناسب برای مکاتب و مراکز آموزشی با تغییرات زیاد.",
    pkgA2Gen: "۱۵ بار ساخت تقسیم اوقات",
    pkgA2Val: "تا ۶ ماه اعتبار",
    pkgA3Name: "پکیج A3 (نامحدود)",
    pkgA3Desc: "پکیج سازمانی برای پوهنتون‌ها و مکاتب بزرگ.",
    pkgA3Gen: "ساخت نامحدود تقسیم اوقات",
    pkgA3Val: "تا ۱ سال اعتبار",
    selectPackage: "انتخاب",
    afnCurrency: "افغانی",

    featuresTitle: "قابلیت‌های هوشمند",
    featuresSubtitle: "طراحی شده برای ساخت تقسیم اوقات دقیق و بدون غلطی.",
    feat1Title: "جلوگیری خودکار از تداخل",
    feat1Desc: "جلوگیری خودکار از اختصاص همزمان یک استاد یا صنف در دو مضمون.",
    feat2Title: "مدیریت نصاب استادان",
    feat2Desc: "تعیین تعداد ساعات درسی هر استاد و روزهای رخصتی به صورت منظم.",
    feat3Title: "خروجی PDF و اکسل",
    feat3Desc: "چاپ مستقیم تقسیم اوقات و خروجی بافرمت استاندارد اکسل و PDF.",

    modalTitle: "ثبت سفارش پکیج",
    modalSub:
      "برای فعال‌سازی پکیج تقسیم اوقات، معلومات مکتب یا پوهنتون خود را وارد کنید.",
    modalSchoolLabel: "نام مکتب / پوهنتون",
    modalSchoolPlaceholder: "مثلاً: لیسه معرفت / پوهنتون کابل",
    modalPhoneLabel: "شماره تماس / واتساپ",
    modalPhonePlaceholder: "۰۷۹۹ XXX XXX یا شماره واتساپ",
    modalPaymentLabel: "روش پرداخت (افغانی)",
    modalPayHesab: "حساب‌پی / موبایل",
    modalPayHesabSub: "پرداخت مستقیم از ولت افغانی",
    modalPayBank: "بانک عزیزی / AIB",
    modalPayBankSub: "انتقال به حساب بانکی",
    modalConfirmBtn: "تایید و ارسال سفارش",
    modalGuarantee: "تضمین فعال‌سازی سریع حساب",
    modalSuccessTitle: "سفارش شما ثبت شد!",
    modalSuccessSub: "تشکر از سفارش شما.",
    modalSuccessMsg:
      "همکاران ما به زودی از طریق واتساپ یا تماس تلفنی جهت تایید پرداخت با شما تماس خواهند گرفت.",
    modalDoneBtn: "بستن و بازگشت",

    loginAuthBadge: "احراز هویت",
    loginReturnHome: "← بازگشت به صفحه اصلی",
    loginTitle: "ورود به سیستم",
    loginSub: "برای ورود به حساب خود، معلومات را وارد کنید.",
    roleAdmin: "مدیر سیستم",
    rolePrincipal: "سرمعلم / آمر",
    roleTeacher: "استاد",
    loginEmailLabel: "ایمیل / نام کاربری",
    loginPassLabel: "رمز عبور",
    loginForgotPass: "رمز عبور را فراموش کرده‌اید؟",
    loginSubmitBtn: "ورود به حساب",
    loginDemoBtn: "ورود یک‌کلیکه به حساب آزمایشی",
    loginPkgCallout: "پکیج A1 (۵۰۰ افغانی)",
    loginViewPkg: "مشاهده پکیج‌ها ←",

    footerTitle: "مکتب یار",
    footerSub: "سیستم هوشمند مدیریت تقسیم اوقات درسی",
    footerRights: "تمامی حقوق برای مکتب یار محفوظ است.",
    footerSystemTitle: "درباره سیستم",
    footerSystemDescription: "مدیریت هوشمند تقسیم اوقات برای مکاتب، پوهنتون‌ها و مراکز آموزشی.",
    footerPagesTitle: "صفحات",
    footerServicesTitle: "درخواست‌ها و خدمات",
    footerCustomPackage: "پکیج خصوصی بسازید",
    footerContactWhatsApp: "تماس از طریق واتساپ",
    footerBuiltBy: "ساخته شده توسط Nexvin",

    dashOverview: "نمای عمومی",
    dashWelcome: "خوش آمدید،",
    dashWelcomeMsg:
      "سیستم مدیریت تقسیم اوقات شما به طور منظم فعال است. شما دارای",
    dashActiveClasses: "صنف فعال و",
    dashTeachersAssigned: "استاد ثبت شده دارید.",
    statClassesTitle: "مجموع صنف‌ها",
    statClassesDesc: "فعال در این سمستر",
    statTeachersTitle: "مجموع استادان",
    statTeachersDesc: "در تمام دیپارتمنت‌ها",
    statSubjectsTitle: "مجموع مضمون‌ها",
    statSubjectsDesc: "ثبت شده در تقسیم اوقات",
    statActive: "فعال",

    qaTitle: "عملیات‌های سریع",
    qaSub: "وظایف و دسترسی‌های پرکاربرد سیستم",
    qaViewTimetableTitle: "مشاهده تقسیم اوقات",
    qaViewTimetableDesc: "دسترسی به تمام تقسیم اوقات‌های ساخته شده",
    qaAddTeacherTitle: "افزودن استاد",
    qaAddTeacherDesc: "ثبت استاد جدید در سیستم",
    qaAddSubjectTitle: "افزودن مضمون",
    qaAddSubjectDesc: "تعریف مضمون درسی جدید",
    qaAddClassTitle: "افزودن صنف",
    qaAddClassDesc: "ایجاد صنف درسی جدید",
    qaAssignmentsTitle: "تخصیص مضمون به استاد",
    qaAssignmentsDesc: "تخصیص استادان به مضامین درسی",
    qaGenerateTitle: "ساخت تقسیم اوقات",
    qaGenerateDesc: "تنظیمات و اجرای الگوریتم ساخت تقسیم اوقات",

    teachersPageBadge: "مدیریت کادر علمی",
    teachersPageTitle: "استادان",
    teachersPageTitleHighlight: "دایرکتوری",
    teachersPageDesc: "مدیریت کادر علمی، پروفایل‌ها و تخصیص مضامین در یک جا.",
    teachersDeleteAll: "حذف همه",
    teachersAddNew: "افزودن استاد",
    teachersSearchPlaceholder: "جستجوی استادان بر اساس نام...",
    teachersEmpty: "استادی یافت نشد",
    teachersEmptyDesc: "هیچ استادی با معیارهای جستجوی شما یافت نشد.",

    classesPageBadge: "مدیریت صنف‌ها",
    classesPageTitle: "صنف‌های",
    classesPageTitleHighlight: "درسی",
    classesPageDesc: "مدیریت تمام صنف‌های مکتب، جدول وقت و تکالیف.",
    classesDeleteAll: "حذف همه",
    classesAddNew: "افزودن صنف",
    classesSearchPlaceholder: "جستجوی صنف‌ها بر اساس نام...",
    classesEmpty: "صنفی یافت نشد",
    classesEmptyDesc: "هیچ صنفی با معیارهای جستجوی شما یافت نشد.",

    subjectsPageBadge: "مدیریت نصاب درسی",
    subjectsPageTitle: "مضامین",
    subjectsPageTitleHighlight: "درسی",
    subjectsPageDesc:
      "تعریف و سازماندهی نصاب درسی مکتب، شامل مضامین اصلی و اختیاری.",
    subjectsDeleteAll: "حذف همه",
    subjectsAddNew: "افزودن مضمون",
    subjectsSearchPlaceholder: "جستجوی مضامین بر اساس نام...",
    subjectsEmpty: "مضمونی یافت نشد",
    subjectsEmptyDesc: "هیچ مضمونی با معیارهای جستجوی شما یافت نشد.",

    assignmentsPageTitle: "تخصیص",
    assignmentsPageTitleHighlight: "مضامین به استادان",
    assignmentsPageDesc:
      "ارتباط دادن استادان با مضامین درسی و تخصیص آن‌ها به صنف‌های خاص.",
    assignmentsDeleteAll: "حذف همه تخصیص‌ها",
    assignmentsSearchPlaceholder: "جستجوی کادر علمی...",
    assignmentsEmpty: "کادر علمی یافت نشد",
    assignmentsEmptyDesc: "هیچ استادی با معیارهای جستجوی شما یافت نشد.",
    assignmentsAddSubject: "افزودن مضمون",
    assignmentsAssignClass: "تخصیص به صنف",
    assignmentsAssignedClasses: "صنف‌های تخصیص یافته",
    assignmentsNoClasses: "هیچ صنفی برای این مضمون تخصیص داده نشده.",

    timetablePageBadge: "برنامه‌ریز درسی",
    timetablePageTitle: "تقسیم اوقات",
    timetablePageTitleHighlight: "اصلی",
    timetablePageDesc:
      "مشاهده و مدیریت جدول درسی، تخصیص ساعات و اتاق‌های درسی.",
    timetableSelectClass: "انتخاب صنف...",
    timetableClassLabel: "صنف",
    menuTeacherTimetable: "تقسیم اوقات استادان",
    teacherTimetablePageBadge: "تقسیم اوقات استادان",
    teacherTimetablePageTitle: "تقسیم اوقات",
    teacherTimetablePageTitleHighlight: "استادان",
    teacherTimetablePageDesc:
      "برنامه هفتگی هر استاد و صنفی را که در هر ساعت تدریس می‌کند مشاهده کنید.",
    teacherTimetableLabel: "استاد",
    teacherTimetableSelect: "انتخاب استاد...",
    teacherTimetableExport: "خروجی",

    // Modals – Add Teacher
    modalAddTeacherTitle: "افزودن استاد جدید",
    modalAddTeacherDesc: "ثبت عضو جدید کادر علمی در سیستم.",
    modalAddTeacherLabel: "نام و نام خانوادگی",
    modalAddTeacherPlaceholder: "مثلاً: پروفیسر احمد رضایی",
    modalAddTeacherSubmit: "ثبت استاد",
    modalAddTeacherSubmitting: "در حال ثبت...",
    modalAddTeacherSuccess: "استاد با موفقیت اضافه شد",
    modalAddTeacherError: "خطا در افزودن استاد",

    // Modals – Add Class
    modalAddClassTitle: "ایجاد صنف درسی",
    modalAddClassDesc:
      "یک گروه دانش‌آموزی جدید برای زمان‌بندی و مدیریت تعریف کنید.",
    modalAddClassLabel: "نام / شناسه صنف",
    modalAddClassPlaceholder: "مثلاً: صنف ۱۱-ب (علوم)",
    modalAddClassSubmit: "ایجاد صنف",
    modalAddClassSubmitting: "در حال ایجاد...",
    modalAddClassSuccess: "صنف درسی با موفقیت ایجاد شد",
    modalAddClassError: "خطا در ایجاد صنف درسی",

    // Modals – Add Subject
    modalAddSubjectTitle: "افزودن مضمون جدید",
    modalAddSubjectDesc:
      "یک مضمون جدید ایجاد کنید و اعضای کادر علمی را تخصیص دهید.",
    modalAddSubjectLabel: "نام مضمون",
    modalAddSubjectPlaceholder: "مثلاً: ریاضیات پیشرفته",
    modalAddSubjectSubmit: "ایجاد مضمون",
    modalAddSubjectSubmitting: "در حال ایجاد...",
    modalAddSubjectSuccess: "مضمون با موفقیت اضافه شد",
    modalAddSubjectError: "خطا در افزودن مضمون",

    // Modals – Assign Subject to Teacher
    modalAssignSubjectTitle: "تخصیص مضمون به استاد",
    modalAssignSubjectDesc:
      "یک عضو کادر علمی را به یک مضمون درسی خاص مرتبط کنید.",
    modalAssignSubjectTeacherLabel: "انتخاب استاد",
    modalAssignSubjectTeacherPlaceholder: "یک استاد انتخاب کنید...",
    modalAssignSubjectSubjectLabel: "انتخاب مضمون",
    modalAssignSubjectSubjectPlaceholder: "یک مضمون انتخاب کنید...",
    modalAssignSubjectPeriodsLabel: "تعداد ساعات در هفته",
    modalAssignSubjectSubmit: "تایید تخصیص",
    modalAssignSubjectSubmitting: "در حال تخصیص...",
    modalAssignSubjectSuccess: "مضمون با موفقیت به استاد تخصیص یافت",
    modalAssignSubjectError: "خطا در تخصیص مضمون",
    modalAssignSubjectValidation: "لطفاً هر دو استاد و مضمون را انتخاب کنید",

    // Modals – Assign Teacher to Class
    modalAssignClassTitle: "تخصیص استاد به صنف",
    modalAssignClassDesc:
      "یک عضو کادر علمی و مضمون آن‌ها را به گروه‌های دانش‌آموزی مرتبط کنید.",
    modalAssignClassTeacherLabel: "عضو کادر علمی",
    modalAssignClassTeacherPlaceholder: "انتخاب استاد",
    modalAssignClassSubjectLabel: "مضمون",
    modalAssignClassSubjectPlaceholder: "انتخاب مضمون",
    modalAssignClassSubjectFirst: "ابتدا استاد را انتخاب کنید",
    modalAssignClassGroupsLabel: "صنف‌های هدف",
    modalAssignClassSubmit: "تایید تخصیص‌ها",
    modalAssignClassSubmitting: "در حال تخصیص...",
    modalAssignClassSuccess: "استاد با موفقیت به صنف‌ها تخصیص یافت",
    modalAssignClassError: "خطا در تخصیص استاد به صنف‌ها",
    modalAssignClassValidation:
      "لطفاً یک استاد، یک مضمون و حداقل یک صنف انتخاب کنید",

    // Modals – General (Edit)
    modalEditUpdateLabel: "به‌روزرسانی اطلاعات",
    modalEditSubmit: "ذخیره تغییرات",
    modalEditSubmitting: "در حال به‌روزرسانی...",

    // Modals – Shared
    modalCancel: "انصراف",

    // Edit modals in pages
    modalEditTeacherTitle: "ویرایش استاد",
    modalEditTeacherDesc: "اطلاعات پروفایل استاد را به‌روز کنید.",
    modalEditTeacherSuccess: "استاد با موفقیت به‌روزرسانی شد",
    modalEditTeacherError: "خطا در به‌روزرسانی استاد",
    modalEditClassTitle: "ویرایش صنف",
    modalEditClassDesc: "نام و جزئیات صنف را به‌روز کنید.",
    modalEditClassSuccess: "صنف با موفقیت به‌روزرسانی شد",
    modalEditClassError: "خطا در به‌روزرسانی صنف",
    modalEditSubjectTitle: "ویرایش مضمون",
    modalEditSubjectDesc: "نام و جزئیات مضمون را به‌روز کنید.",
    modalEditSubjectSuccess: "مضمون با موفقیت به‌روزرسانی شد",
    modalEditSubjectError: "خطا در به‌روزرسانی مضمون",

    // Confirmation modals
    confirmDeleteTeacherTitle: "حذف استاد",
    confirmDeleteTeacherDesc:
      "آیا مطمئن هستید که می‌خواهید همه استادان را حذف کنید؟",
    confirmDeleteTeacherSingleSuccess: "استاد با موفقیت حذف شد",
    confirmDeleteTeacherSingleError: "خطا در حذف استاد",
    confirmDeleteAllTeachersSuccess: "همه استادان با موفقیت حذف شدند",
    confirmDeleteAllTeachersError: "خطا در حذف استادان",
    confirmDeleteClassSingleSuccess: "صنف با موفقیت حذف شد",
    confirmDeleteClassSingleError: "خطا در حذف صنف",
    confirmDeleteAllClassesTitle: "حذف همه صنف‌ها",
    confirmDeleteAllClassesDesc:
      "آیا مطمئن هستید که می‌خواهید همه صنف‌ها را حذف کنید؟",
    confirmDeleteAllClassesSuccess: "همه صنف‌ها با موفقیت حذف شدند",
    confirmDeleteAllClassesError: "خطا در حذف صنف‌ها",
    confirmDeleteSubjectSingleSuccess: "مضمون با موفقیت حذف شد",
    confirmDeleteSubjectSingleError: "خطا در حذف مضمون",
    confirmDeleteAllSubjectsTitle: "حذف همه مضمون‌ها",
    confirmDeleteAllSubjectsDesc:
      "آیا مطمئن هستید که می‌خواهید همه مضمون‌ها را حذف کنید؟ این عمل قابل بازگشت نیست.",
    confirmDeleteAllSubjectsSuccess: "همه مضمون‌ها با موفقیت حذف شدند",
    confirmDeleteAllSubjectsError: "خطا در حذف همه مضمون‌ها",
    confirmDeleteText: "حذف همه",
    confirmCancelText: "انصراف",

    // Suspense
    loadingTeachers: "در حال بارگذاری کادر علمی...",
    loadingClasses: "در حال بارگذاری صنف‌ها...",
    loadingSubjects: "در حال بارگذاری مضمون‌ها...",
  },
  ps: {
    brandName: "مکتب یار",
    brandTagline: "د تقسیم اوقات هوښیار مدیریت سیستم",
    brandAlt: "د مکتب یار لوګو",

    navPackages: "پکېجونه او قیمتونه",
    navFeatures: "د سیستم بڼې",
    navSignIn: "ننوتل",
    navDashboard: "ډش بورډ ته ننوتل",

    quickSearch: "چټکه لټون",
    searchPlaceholder: "هر څه وپالئ...",
    adminUser: "اډمین کارن",
    systemAdmin: "د سیستم عمومی مدیر",
    viewProfile: "پروفایل کتل",
    accountSettings: "د حساب تنظیمات",
    signOut: "وتل",
    mainNavigation: "اصلي مینو",
    menuDashboard: "ډش بورډ",
    menuTeachers: "استادان",
    menuClasses: "ټولګي",
    menuSubjects: "مضمونونه",
    menuAssignments: "درسي دندې",
    menuTimetable: "تقسیم اوقات",
    menuSettings: "ترتیبات",
    profile: "پروفایل",
    exit: "وتل",
    website: "ویبپاڼه",

    heroBadge: "مسلکي تقسیم اوقات سیستم",
    heroTitle1: "د درسي تقسیم اوقات",
    heroTitleHighlight: "اتومات مدیریت سیستم",
    heroDescription:
      "د ښوونځیو، پوهنتونونو او انستیتیوتونو لپاره د تقسیم اوقات ماډرن سیستم. بې له ټکر څخه درسي وېش او اسانه چاپ.",
    heroBtnPackages: "پکېجونه کتل (۵۰۰ افغانۍ)",
    heroBtnSignIn: "ډش بورډ ته ننوتل",

    packagesTitle: "پکېجونه او قیمتونه",
    packagesSubtitle:
      "د خپلې تعلیمي ادارې لپاره مناسب پکېج غوره کړئ. A1 پکېج کې ۵ ځله تقسیم اوقات جوړول په ۵۰۰ افغانۍ شامل دي.",
    pkgTrialName: "وړیا ازمایښتي",
    pkgTrialDesc: "د لومړي تقسیم اوقات د ټسټ او ازموینې لپاره.",
    pkgTrialGen: "۱ ځل تقسیم اوقات جوړول",
    pkgTrialVal: "۷ ورځې موده",
    pkgA1Name: "پکېج A1",
    pkgA1Badge: "سپارښتنه شوی",
    pkgA1Desc: "د سمسټر او ربعوار تقسيم اوقاتونو د تغیر لپاره معياري پکېج.",
    pkgA1Gen: "۵ ځلې تقسیم اوقات جوړول",
    pkgA1Val: "تر ۲ میاشتو موده",
    pkgA1Btn: "د A1 پکېج اخیستل (۵۰۰ افغانۍ)",
    pkgA2Name: "پکېج A2",
    pkgA2Badge: "غوره ارزښت",
    pkgA2Desc: "د ډېرو درسي بدلونو لرونکو ښوونځیو لپاره مناسب پکېج.",
    pkgA2Gen: "۱۵ ځلې تقسیم اوقات جوړول",
    pkgA2Val: "تر ۶ میاشتو موده",
    pkgA3Name: "پکېج A3 (لامحدود)",
    pkgA3Desc: "د لويو پوهنتونونو او ښوونځیو لپاره لامحدود پکېج.",
    pkgA3Gen: "لامحدود تقسیم اوقات جوړول",
    pkgA3Val: "تر ۱ کال موده",
    selectPackage: "غوره کول",
    afnCurrency: "افغانۍ",

    featuresTitle: "د سیستم وړتیاوې",
    featuresSubtitle: "د دقیق او بې غلطۍ تقسیم اوقات جوړولو لپاره جوړ شوی.",
    feat1Title: "د ټکر اتومات مخنیوی",
    feat1Desc: "په یو وخت کې د استاد یا ټولګي د تداخل اتومات مخنیوی کوي.",
    feat2Title: "د استادانو د درسي ساعتونو تنظیم",
    feat2Desc: "د هر استاد لپاره د درسي ساعتونو اود رخصتیو ورځو منظم تنظیم.",
    feat3Title: "PDF او Excel ډاونلوډ",
    feat3Desc:
      "د تقسيم اوقات مستقیم چاپ او په اکسل او پی ډی ایف کې ترلاسه کول.",

    modalTitle: "د پکېج فرمایش ثبتول",
    modalSub: "د خپل درسي پکېج د فعالولو لپاره د خپل ښوونځي معلومات داخل کړئ.",
    modalSchoolLabel: "د ښوونځي / پوهنتون نوم",
    modalSchoolPlaceholder: "مثلاً: معرفت لېسه / کابل پوهنتون",
    modalPhoneLabel: "د اړیکې شمیره / واټساپ",
    modalPhonePlaceholder: "۰۷۹۹ XXX XXX یا د واټساپ شمیره",
    modalPaymentLabel: "د تادیې لاره (افغانۍ)",
    modalPayHesab: "حساب‌پی / موبایل",
    modalPayHesabSub: "له افغاني والټ څخه مستقیم تادیه",
    modalPayBank: "عزیزي بانک / AIB",
    modalPayBankSub: "بانکي حساب ته انتقال",
    modalConfirmBtn: "فرمایش تاییدول",
    modalGuarantee: "د حساب ژر تر ژره فعالولو تضمین",
    modalSuccessTitle: "ستاسو فرمایش ثبت شو!",
    modalSuccessSub: "مننه له ستاسو فرمایش څخه.",
    modalSuccessMsg:
      "زموږ همکاران به ډېر ژر د واټساپ یا اړیکې لارې له تاسو سره اړیکه ونیسي.",
    modalDoneBtn: "تړل او بیرته تلل",

    loginAuthBadge: "ننوتل",
    loginReturnHome: "← اصلي پاڼې ته بیرته تلل",
    loginTitle: "سیستم ته ننوتل",
    loginSub: "خپل حساب ته د ننوتلو لپاره معلومات داخل کړئ.",
    roleAdmin: "مدیر",
    rolePrincipal: "سرمعلم",
    roleTeacher: "استاد",
    loginEmailLabel: "ایمېل / کارن نوم",
    loginPassLabel: "پټنوم",
    loginForgotPass: "پټنوم مو هېر شوی؟",
    loginSubmitBtn: "ننوتل",
    loginDemoBtn: "آزمایښتي حساب ته پټ یو کلیک ننوتل",
    loginPkgCallout: "پکېج A1 (۵۰۰ افغانۍ)",
    loginViewPkg: "پکېجونه کتل ←",

    footerTitle: "مکتب یار",
    footerSub: "د درسي تقسیم اوقات هوشمند مدیریت سیستم",
    footerRights: "ټول حقونه له مکتب یار سره خوندي دي.",
    footerSystemTitle: "د سیستم په اړه",
    footerSystemDescription: "د ښوونځیو، پوهنتونونو او ښوونیزو مرکزونو لپاره د تقسیم اوقات هوښیار مدیریت.",
    footerPagesTitle: "پاڼې",
    footerServicesTitle: "غوښتنې او خدمتونه",
    footerCustomPackage: "خپل ځانګړی پکېج جوړ کړئ",
    footerContactWhatsApp: "په واټساپ کې اړیکه ونیسئ",
    footerBuiltBy: "د Nexvin لخوا جوړ شوی",

    dashOverview: "عمومي لید",
    dashWelcome: "ښه راغلاست،",
    dashWelcomeMsg:
      "ستاسو د تقسیم اوقات مدیریت سیستم په منظم ډول فعال دی. تاسو",
    dashActiveClasses: "فعال ټولګي او",
    dashTeachersAssigned: "استادان ثبت شوي لرئ.",
    statClassesTitle: "ټول ټولګي",
    statClassesDesc: "په دې سمسټر کې فعال",
    statTeachersTitle: "ټول استادان",
    statTeachersDesc: "په ټولو پوهنځیو کې",
    statSubjectsTitle: "ټول مضمونونه",
    statSubjectsDesc: "په تقسیم اوقات کې شامل",
    statActive: "فعال",

    qaTitle: "چټکې کړنې",
    qaSub: "عامې دندې او عملیاتونه",
    qaViewTimetableTitle: "تقسیم اوقات کتل",
    qaViewTimetableDesc: "ټولو جوړ شوو تقسیم اوقاتونو ته لاسرسی",
    qaAddTeacherTitle: "استاد زیاتول",
    qaAddTeacherDesc: "نوی استاد راجستر کول",
    qaAddSubjectTitle: "مضمون زیاتول",
    qaAddSubjectDesc: "نوی درسي مضمون تشرېح کول",
    qaAddClassTitle: "ټولګی زیاتول",
    qaAddClassDesc: "نوی درسي ټولګی جوړول",
    qaAssignmentsTitle: "استاد او مضمون نښلول",
    qaAssignmentsDesc: "مضمونونو ته د استادانو وېشل",
    qaGenerateTitle: "تقسیم اوقات جوړول",
    qaGenerateDesc: "د تقسیم اوقات جوړولو ترتیبات",

    teachersPageBadge: "د علمي کادر مدیریت",
    teachersPageTitle: "استادان",
    teachersPageTitleHighlight: "لیست",
    teachersPageDesc: "د علمي کادر، پروفایلونو او درسي دندو مدیریت یو ځای کې.",
    teachersDeleteAll: "ټول ړنګول",
    teachersAddNew: "نوی استاد زیاتول",
    teachersSearchPlaceholder: "د نوم له مخې استادان پلټل...",
    teachersEmpty: "استاد ونه موندل شو",
    teachersEmptyDesc: "ستاسو د لټون معیارونو سره سم هیڅ استاد ونه موندل شو.",

    classesPageBadge: "د ټولګیو مدیریت",
    classesPageTitle: "درسي",
    classesPageTitleHighlight: "ټولګي",
    classesPageDesc: "د ټولو ښوونځیو ټولګیو، جدول او دندو مدیریت.",
    classesDeleteAll: "ټول ړنګول",
    classesAddNew: "نوی ټولګی زیاتول",
    classesSearchPlaceholder: "د نوم له مخې ټولګي پلټل...",
    classesEmpty: "ټولګی ونه موندل شو",
    classesEmptyDesc: "ستاسو د لټون معیارونو سره سم هیڅ ټولګی ونه موندل شو.",

    subjectsPageBadge: "د نصاب مدیریت",
    subjectsPageTitle: "درسي",
    subjectsPageTitleHighlight: "مضمونونه",
    subjectsPageDesc:
      "د ښوونځي د درسي نصاب، اصلي او اختیاري مضمونونو تعریف او تنظیم.",
    subjectsDeleteAll: "ټول ړنګول",
    subjectsAddNew: "نوی مضمون زیاتول",
    subjectsSearchPlaceholder: "د نوم له مخې مضمونونه پلټل...",
    subjectsEmpty: "مضمون ونه موندل شو",
    subjectsEmptyDesc: "ستاسو د لټون معیارونو سره سم هیڅ مضمون ونه موندل شو.",

    assignmentsPageTitle: "د درسي",
    assignmentsPageTitleHighlight: "دندو وېشل",
    assignmentsPageDesc:
      "استادان د خپلو مضمونونو سره نښلول او د ټولګیو ته یې وېشل.",
    assignmentsDeleteAll: "ټولې درسي دندې ړنګول",
    assignmentsSearchPlaceholder: "د علمي کادر لټون...",
    assignmentsEmpty: "علمي کادر ونه موندل شو",
    assignmentsEmptyDesc:
      "ستاسو د لټون معیارونو سره سم هیڅ استاد ونه موندل شو.",
    assignmentsAddSubject: "مضمون زیاتول",
    assignmentsAssignClass: "ټولګي ته ورکول",
    assignmentsAssignedClasses: "ورکړل شوي ټولګي",
    assignmentsNoClasses: "د دې مضمون لپاره هیڅ ټولګی نه دی ورکړل شوی.",

    timetablePageBadge: "د وخت برنامه جوړوونکی",
    timetablePageTitle: "اصلي",
    timetablePageTitleHighlight: "تقسیم اوقات",
    timetablePageDesc: "د درسي جدول، د وخت وېشنې او د کوټو مدیریت.",
    timetableSelectClass: "ټولګی غوره کړئ...",
    timetableClassLabel: "ټولګی",
    menuTeacherTimetable: "د استادانو تقسیم اوقات",
    teacherTimetablePageBadge: "د استادانو مهالویش",
    teacherTimetablePageTitle: "د استادانو",
    teacherTimetablePageTitleHighlight: "تقسیم اوقات",
    teacherTimetablePageDesc:
      "د هر استاد او په هره دوره کې د هغه د تدریس ټولګي اوونیز مهالویش وګورئ.",
    teacherTimetableLabel: "استاد",
    teacherTimetableSelect: "استاد وټاکئ...",
    teacherTimetableExport: "صادرول",

    // Modals – Add Teacher
    modalAddTeacherTitle: "نوی استاد زیاتول",
    modalAddTeacherDesc: "د سیستم کې د نوي علمي کادر غړي ثبتول.",
    modalAddTeacherLabel: "بشپړ نوم",
    modalAddTeacherPlaceholder: "مثلاً: پروفیسر احمد",
    modalAddTeacherSubmit: "استاد ثبتول",
    modalAddTeacherSubmitting: "د ثبتولو په حال کې...",
    modalAddTeacherSuccess: "استاد بریالیتوب سره زیات شو",
    modalAddTeacherError: "د استاد د زیاتولو کې ستونزه",

    // Modals – Add Class
    modalAddClassTitle: "درسي ټولګی جوړول",
    modalAddClassDesc:
      "د مهال ویش او مدیریت لپاره نوی د زده‌کونکو ګروپ تعریف کړئ.",
    modalAddClassLabel: "د ټولګي نوم / پیژندپاڼه",
    modalAddClassPlaceholder: "مثلاً: ۱۱مه ټولګي-ب (ساینس)",
    modalAddClassSubmit: "ټولګی جوړول",
    modalAddClassSubmitting: "د جوړولو په حال کې...",
    modalAddClassSuccess: "درسي ټولګی بریالیتوب سره جوړ شو",
    modalAddClassError: "د درسي ټولګي د جوړولو کې ستونزه",

    // Modals – Add Subject
    modalAddSubjectTitle: "نوی مضمون زیاتول",
    modalAddSubjectDesc: "نوی مضمون جوړ کړئ او د علمي کادر غړي ورته وټاکئ.",
    modalAddSubjectLabel: "د مضمون نوم",
    modalAddSubjectPlaceholder: "مثلاً: پرمختللی ریاضیات",
    modalAddSubjectSubmit: "مضمون جوړول",
    modalAddSubjectSubmitting: "د جوړولو په حال کې...",
    modalAddSubjectSuccess: "مضمون بریالیتوب سره زیات شو",
    modalAddSubjectError: "د مضمون د زیاتولو کې ستونزه",

    // Modals – Assign Subject to Teacher
    modalAssignSubjectTitle: "استاد ته مضمون ورکول",
    modalAssignSubjectDesc:
      "د علمي کادر غړی د یو ځانګړي درسي مضمون سره وصل کړئ.",
    modalAssignSubjectTeacherLabel: "استاد غوره کول",
    modalAssignSubjectTeacherPlaceholder: "استاد غوره کړئ...",
    modalAssignSubjectSubjectLabel: "مضمون غوره کول",
    modalAssignSubjectSubjectPlaceholder: "مضمون غوره کړئ...",
    modalAssignSubjectPeriodsLabel: "د اونۍ درسي ساعتونه",
    modalAssignSubjectSubmit: "د ورکولو تاییدول",
    modalAssignSubjectSubmitting: "د ورکولو په حال کې...",
    modalAssignSubjectSuccess: "مضمون بریالیتوب سره استاد ته ورکړل شو",
    modalAssignSubjectError: "د مضمون د ورکولو کې ستونزه",
    modalAssignSubjectValidation: "مهرباني وکړئ دواړه استاد او مضمون غوره کړئ",

    // Modals – Assign Teacher to Class
    modalAssignClassTitle: "ټولګي ته استاد ورکول",
    modalAssignClassDesc:
      "د علمي کادر غړی او د هغوی مضمون د زده‌کونکو ګروپونو سره وصل کړئ.",
    modalAssignClassTeacherLabel: "د علمي کادر غړی",
    modalAssignClassTeacherPlaceholder: "استاد غوره کول",
    modalAssignClassSubjectLabel: "مضمون",
    modalAssignClassSubjectPlaceholder: "مضمون غوره کول",
    modalAssignClassSubjectFirst: "لومړی استاد غوره کړئ",
    modalAssignClassGroupsLabel: "د هدف ټولګي ګروپونه",
    modalAssignClassSubmit: "د ورکولو تاییدول",
    modalAssignClassSubmitting: "د ورکولو په حال کې...",
    modalAssignClassSuccess: "استاد بریالیتوب سره ټولګیو ته ورکړل شو",
    modalAssignClassError: "د استاد د ټولګیو ته ورکولو کې ستونزه",
    modalAssignClassValidation:
      "مهرباني وکړئ استاد، مضمون او لږترلږه یو ټولګی غوره کړئ",

    // Modals – General (Edit)
    modalEditUpdateLabel: "د معلوماتو تازه کول",
    modalEditSubmit: "بدلونونه خوندي کول",
    modalEditSubmitting: "د تازه کولو په حال کې...",

    // Modals – Shared
    modalCancel: "لغوه کول",

    // Edit modals in pages
    modalEditTeacherTitle: "استاد سمول",
    modalEditTeacherDesc: "د استاد د پروفایل معلومات تازه کړئ.",
    modalEditTeacherSuccess: "استاد بریالیتوب سره تازه شو",
    modalEditTeacherError: "د استاد د تازه کولو کې ستونزه",
    modalEditClassTitle: "ټولګی سمول",
    modalEditClassDesc: "د ټولګي نوم او توضیحات تازه کړئ.",
    modalEditClassSuccess: "ټولګی بریالیتوب سره تازه شو",
    modalEditClassError: "د ټولګي د تازه کولو کې ستونزه",
    modalEditSubjectTitle: "مضمون سمول",
    modalEditSubjectDesc: "د مضمون نوم او توضیحات تازه کړئ.",
    modalEditSubjectSuccess: "مضمون بریالیتوب سره تازه شو",
    modalEditSubjectError: "د مضمون د تازه کولو کې ستونزه",

    // Confirmation modals
    confirmDeleteTeacherTitle: "استاد ړنګول",
    confirmDeleteTeacherDesc: "ایا ډاډه یاست چې ټول استادان ړنګول غواړئ؟",
    confirmDeleteTeacherSingleSuccess: "استاد بریالیتوب سره ړنګ شو",
    confirmDeleteTeacherSingleError: "د استاد د ړنګولو کې ستونزه",
    confirmDeleteAllTeachersSuccess: "ټول استادان بریالیتوب سره ړنګ شول",
    confirmDeleteAllTeachersError: "د استادانو د ړنګولو کې ستونزه",
    confirmDeleteClassSingleSuccess: "ټولګی بریالیتوب سره ړنګ شو",
    confirmDeleteClassSingleError: "د ټولګي د ړنګولو کې ستونزه",
    confirmDeleteAllClassesTitle: "ټول ټولګي ړنګول",
    confirmDeleteAllClassesDesc: "ایا ډاډه یاست چې ټول ټولګي ړنګول غواړئ؟",
    confirmDeleteAllClassesSuccess: "ټول ټولګي بریالیتوب سره ړنګ شول",
    confirmDeleteAllClassesError: "د ټولګیو د ړنګولو کې ستونزه",
    confirmDeleteSubjectSingleSuccess: "مضمون بریالیتوب سره ړنګ شو",
    confirmDeleteSubjectSingleError: "د مضمون د ړنګولو کې ستونزه",
    confirmDeleteAllSubjectsTitle: "ټول مضمونونه ړنګول",
    confirmDeleteAllSubjectsDesc:
      "ایا ډاډه یاست چې ټول مضمونونه ړنګول غواړئ؟ دا کار بیرته نه‌شي اخیستل.",
    confirmDeleteAllSubjectsSuccess: "ټول مضمونونه بریالیتوب سره ړنګ شول",
    confirmDeleteAllSubjectsError: "د ټولو مضمونونو د ړنګولو کې ستونزه",
    confirmDeleteText: "ټول ړنګول",
    confirmCancelText: "لغوه کول",

    // Suspense
    loadingTeachers: "د علمي کادر بارولو په حال کې...",
    loadingClasses: "د ټولګیو بارولو په حال کې...",
    loadingSubjects: "د مضمونونو بارولو په حال کې...",
  },
};
