export const menuItems = [
  {
      title: 'Dashboard',
      routerLink: 'dashboard',
      icon: 'fa-home',
      selected: false,
      expanded: false,
      order: 0
  },
  {
      title: 'Super Admin',
      routerLink: 'superadmin',
      icon: 'fa-lock',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [
          {
              title: 'Module Config',
              routerLink: 'superadmin/modulecnfglist',
          },
          {
              title: 'Field Config',
              routerLink: 'superadmin/fieldcnfglist',
          },

          {
              title: 'Form Config',
              routerLink: 'superadmin/formconfiglist',
          },
          {
              title: 'Agency Setup',
              routerLink: 'superadmin/agencylist',
          },
          {
              title: 'Area Office Setup',
              routerLink: 'superadmin/areaofficesetuplist',
          },
          {
              title: 'Compliance Check ',
              routerLink: 'superadmin/compliancechecktypelist',
          },

          {
              title: 'Role Profile',
              routerLink: 'superadmin/roleprofilelist',
          },

          {
              title: 'Agency Form Mapping',
              routerLink: 'superadmin/agencyformmapping',
          },
          {
              title: 'Local Authority',
              routerLink: 'superadmin/localauthoritylist',
          },
          {
              title: 'Local Authority SW',
              routerLink: 'superadmin/localauthorityswlist',
          },

      ]
  },
  {
      title: 'Recruitment',
      routerLink: 'recruitment',
      icon: 'fa fa-user',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [

          {
              title: 'Applicant List',
              routerLink: 'recruitment/applicantlist',
          },
          {
              title: 'Carer Interest Info',
              routerLink: 'recruitment/carerinterestinfo',
          },
          {
              title: 'InitialEnquiry',
              routerLink: 'recruitment/initialenquiry/0',
          },
          {
              title: 'Application Form',
              routerLink: 'recruitment/carerapplication',
          },
          {
              title: 'Initial Home Visit',
              routerLink: 'recruitment/carerinitialhomevisit',
          },

          {
              title: 'Carer Family',
              routerLink: 'recruitment/carerfamily',
          },
          {
              title: 'Backup Carer List',
              routerLink: 'recruitment/backupcarerlist',
          },

          {
              title: 'Health And Safety',
              routerLink: 'recruitment/carerhealthandsafetylist',
          },

          {
              title: 'Pet Questionnaires',
              routerLink: 'recruitment/carerpetquestionnairelist',
          },

          {
              title: 'Training Profile',
              routerLink: 'recruitment/carertrainingprofilelist',
          },
          {
              title: 'Safe Care Policy',
              routerLink: 'recruitment/safercarepolicylist',
          },

          {
              title: 'Statutory Check',
              routerLink: 'superadmin/statutorychecklist/3',
          },
          {
              title: 'Approve Carer',
              routerLink: 'recruitment/carerapprove',
          },
          {
              title: 'Status Change',
              routerLink: 'recruitment/carerstatuschange',
          },
      ]
  },
  {
      title: 'Foster Carer',
      routerLink: 'recruitment',
      icon: 'fa-users',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [
          {
              title: 'Carer List',
              routerLink: 'recruitment/approvedcarer',
          },
          {
              title: 'Carer Interest Info',
              routerLink: 'recruitment/carerinterestinfo',
          },
          {
              title: 'Application Form',
              routerLink: 'recruitment/carerapplication',
          },
          {
              title: 'InitialEnquiry',
              routerLink: 'recruitment/initialenquiry/0',
          },

          {
              title: 'Initial Home Visit',
              routerLink: 'recruitment/carerinitialhomevisit',
          },
          {
              title: 'Pet Questionnaires',
              routerLink: 'recruitment/carerpetquestionnairelist',
          },
          {
              title: 'Health And Safety',
              routerLink: 'recruitment/carerhealthandsafetylist',
          },
          {
              title: 'Carer Family',
              routerLink: 'recruitment/carerfamily',
          },

          {
              title: 'OOH Report ',
              routerLink: 'recruitment/careroohreportlist',
          },
          {
              title: 'Backup Carer List',
              routerLink: 'recruitment/backupcarerlist',
          },
          {
              title: 'Safe Care Policy',
              routerLink: 'recruitment/safercarepolicylist',
          },



          {
              title: 'Training Profile',
              routerLink: 'recruitment/carertrainingprofilelist',
          },
          {
              title: 'Supervisory Home Visit',
              routerLink: 'recruitment/carersupervisoryhomevisitlist',
          },
          {
              title: 'Status Change',
              routerLink: 'recruitment/carerstatuschange',
          },
          //{
          //    title: 'Carer Approve',
          //    routerLink: 'recruitment/carerapprove',
          //},

      ]
  },
  {
      title: 'Referrals',
      routerLink: 'referral',
      icon: 'fa-handshake-o',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [
          {
              title: 'Child List',
              routerLink: 'referral/referralprofilelink',
          },
          {
              title: 'Quick Referral',
              routerLink: 'referral/childprofile/1',
          },
          {
              title: 'Referral',
              routerLink: 'referral/childreferral',
          },
          {
              title: 'Placement',
              routerLink: 'referral/childplacement/0',
          },
          {
              title: 'Day Log/Journal',
              routerLink: 'referral/childdayloglist',
          },
          {
              title: 'Next Day Action Log',
              routerLink: 'child/nextdayactionloglist',
          },

      ]
  },
  {
      title: 'Foster Child',
      routerLink: 'child',
      icon: 'fa-child',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [
          {
              title: 'Child List',
              routerLink: 'child/childprofilelink',
          },
          {
              title: 'Chronology of Events',
              routerLink: 'child/childchronologyofeventlist',
          },


          {
              title: 'CLA Review',
              routerLink: 'child/childclareviewlist',
          },
          {
              title: 'OOH Report',
              routerLink: 'child/childoohreportlist',
          },
          {
              title: 'Pathway plan',
              routerLink: 'child/childpathwayplanlist',
          },

          {
              title: 'Foster Carer Diary Record',
              routerLink: 'child/fostercarerdiaryrecordinglist',
          },
          {
              title: 'Educational Info',
              routerLink: 'child/childeducationalinfolist',
          },
          {
              title: 'School Detail',
              routerLink: 'child/childschooldetailinfolist',
          },

          {
              title: 'Absence Details',
              routerLink: 'child/childeducationabsenceinfolist',
          },
          {
              title: 'Exclusion Details',
              routerLink: 'child/childeducationexclusioninfolist',
          },

          {
              title: 'Out of School Activity',
              routerLink: 'child/childeducationoutofschoolactivityinfolist',
          },
          {
              title: 'Study Support',
              routerLink: 'child/childeducationstudysupportinfolist',
          },

          {
              title: 'Personal Education Plan',
              routerLink: 'child/childeducationpepinfolist',
          },
          {
              title: 'Vocational Course',
              routerLink: 'child/childeducationvocationalcourseinfolist',
          },

          {
              title: 'Health Info',
              routerLink: 'child/childhealthinfolist',
          },
          {
              title: 'Appointment Details',
              routerLink: 'child/childhealthappointmentinfolist',
          },

          {
              title: 'Behavioural Info',
              routerLink: 'child/childhealthbehaviouralinfo',
          },
          {
              title: 'Immunisation Details',
              routerLink: 'child/childhealthimmunisationinfolist',
          },

          {
              title: 'Medical Visit',
              routerLink: 'child/childhealthmedicalvisitinfolist',
          },

          {
              title: 'Medication Details',
              routerLink: 'child/childhealthmedicationinfolist',
          },
          {
              title: 'Therapy Info',
              routerLink: 'child/childhealththerapyinfolist',
          },

          {
              title: 'Physician Info',
              routerLink: 'child/physicianinfolist',
          },

      ]
  },
  {
      title: 'Other Forms',
      routerLink: 'others',
      icon: 'fa-child',
      selected: false,
      expanded: false,
      order: 200,
      subMenu: [
          {
              title: 'Allegation',
              routerLink: 'others/allegationlist',
          },
          {
              title: 'Complaint',
              routerLink: 'others/complaintlist',
          },
          {
              title: 'Incident',
              routerLink: 'others/incidentlist',
          },

      ]
  },





  //{
  //    title: 'Referral',
  //    routerLink: 'referral',
  //    icon: 'fa-child',
  //    selected: false,
  //    expanded: false,
  //    order: 200,
  //    subMenu: [
  //        {
  //            title: 'Child List',
  //            routerLink: 'referral/ChildProfileList',
  //        },

  //    ]
  //},
  //{
  //  title: 'Charts',
  //  routerLink: 'charts',
  //  icon: 'fa-bar-chart',
  //  selected: false,
  //  expanded: false,
  //  order: 200,
  //  subMenu: [
  //    {
  //      title: 'Ng2-Charts',
  //      routerLink: 'charts/ng2charts',
  //    },
  //  ]
  //},
  //{
  //    title: 'UI Features',
  //    routerLink: 'ui',
  //    icon: 'fa-laptop',
  //    selected: false,
  //    expanded: false,
  //    order: 300,
  //    subMenu: [
  //        {
  //            title: 'Buttons',
  //            routerLink: 'ui/buttons'
  //        },
  //        {
  //            title: 'Cards',
  //            routerLink: 'ui/cards'
  //        },
  //        {
  //            title: 'Components',
  //            routerLink: 'ui/components'
  //        },
  //        {
  //            title: 'Icons',
  //            routerLink: 'ui/icons'
  //        },
  //        {
  //            title: 'Grid',
  //            routerLink: 'ui/grid'
  //        },
  //        {
  //            title: 'List Group',
  //            routerLink: 'ui/list-group'
  //        },
  //        {
  //            title: 'Media Objects',
  //            routerLink: 'ui/media-objects'
  //        },
  //        {
  //            title: 'Tabs & Accordions',
  //            routerLink: 'ui/tabs-accordions'
  //        },
  //        {
  //            title: 'Typography',
  //            routerLink: 'ui/typography'
  //        }
  //    ]
  //},
  //{
  //  title: 'Mail',
  //  routerLink: 'mail/mail-list/inbox',
  //  icon: 'fa-envelope-o',
  //  selected: false,
  //  expanded: false,
  //  order: 330
  //},
  //{
  //  title: 'Calendar',
  //  routerLink: 'calendar',
  //  icon: 'fa-calendar',
  //  selected: false,
  //  expanded: false,
  //  order: 350
  //},
  //{
  //    title: 'Form Elements',
  //    routerLink: 'form-elements',
  //    icon: 'fa-pencil-square-o',
  //    selected: false,
  //    expanded: false,
  //    order: 400,
  //    subMenu: [
  //        {
  //            title: 'Form Inputs',
  //            routerLink: 'form-elements/inputs'
  //        },
  //        {
  //            title: 'Form Layouts',
  //            routerLink: 'form-elements/layouts'
  //        },
  //        {
  //            title: 'Form Validations',
  //            routerLink: 'form-elements/validations'
  //        },
  //        {
  //            title: 'Form Wizard',
  //            routerLink: 'form-elements/wizard'
  //        }
  //    ]
  //},
  //{
  //    title: 'Tables',
  //    routerLink: 'tables',
  //    icon: 'fa-table',
  //    selected: false,
  //    expanded: false,
  //    order: 500,
  //    subMenu: [
  //        {
  //            title: 'Basic Tables',
  //            routerLink: 'tables/basic-tables'
  //        },
  //        {
  //            title: 'Dynamic Tables',
  //            routerLink: 'tables/dynamic-tables'
  //        }
  //    ]
  //},
  //{
  //  title: 'Editors',
  //  routerLink: 'editors',
  //  icon: 'fa-pencil',
  //  selected: false,
  //  expanded: false,
  //  order: 550,
  //  subMenu: [
  //    {
  //      title: 'Froala Editor',
  //      routerLink: 'editors/froala-editor'
  //    },
  //    {
  //      title: 'Ckeditor',
  //      routerLink: 'editors/ckeditor'
  //    }
  //  ]
  //},
  //{
  //  title: 'Maps',
  //  routerLink: 'maps',
  //  icon: 'fa-globe',
  //  selected: false,
  //  expanded: false,
  //  order: 600,
  //  subMenu: [
  //    {
  //      title: 'Vector Maps',
  //      routerLink: 'maps/vectormaps'
  //    },
  //    {
  //      title: 'Google Maps',
  //      routerLink: 'maps/googlemaps'
  //    },
  //    {
  //      title: 'Leaflet Maps',
  //      routerLink: 'maps/leafletmaps'
  //    }
  //  ]
  //},
  //{
  //    title: 'Pages',
  //    routerLink: ' ',
  //    icon: 'fa-file-o',
  //    selected: false,
  //    expanded: false,
  //    order: 650,
  //    subMenu: [
  //        {
  //            title: 'Login',
  //            routerLink: '/login'
  //        },
  //        {
  //            title: 'Register',
  //            routerLink: '/register'
  //        },
  //        {
  //            title: 'Blank Page',
  //            routerLink: 'blank'
  //        },
  //        {
  //            title: 'Error Page',
  //            routerLink: '/pagenotfound'
  //        }
  //    ]
  //},
  //{
  //  title: 'Menu Level 1',
  //  icon: 'fa-ellipsis-h',
  //  selected: false,
  //  expanded: false,
  //  order: 700,
  //  subMenu: [
  //    {
  //      title: 'Menu Level 1.1',
  //      url: '#',
  //      disabled: true,
  //      selected: false,
  //      expanded: false
  //    },
  //    {
  //      title: 'Menu Level 1.2',
  //      url: '#',
  //      subMenu: [{
  //        title: 'Menu Level 1.2.1',
  //        url: '#',
  //        disabled: true,
  //        selected: false,
  //        expanded: false
  //      }]
  //    }
  //  ]
  //},
  //{
  //  title: 'External Link',
  //  url: 'http://themeseason.com',
  //  icon: 'fa-external-link',
  //  selected: false,
  //  expanded: false,
  //  order: 800,
  //  target: '_blank'
  //}
];
