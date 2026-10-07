// Site-wide settings. Paste the real links here when they are ready.
// Leave a link as '' to hide that icon everywhere on the site.
export const social = [
  { id: 'youtube',   label: 'YouTube',   href: 'https://www.youtube.com/SacredassociationOrg' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/shri_anand_shakti_ashram' },
  { id: 'facebook',  label: 'Facebook',  href: '' },   // hidden until a link is shared
  { id: 'whatsapp',  label: 'WhatsApp',  href: '' },   // hidden until a link is shared
];

export const contactEmail = 'swarodayashiva@gmail.com';

// Used on the Privacy and Terms pages. Fill in before launch.
export const legal = {
  operator: 'The Shakti Multiversity',
  address: 'Shri Shaktipuram, Langha Forest Range, Binhar, Uttarakhand 248125, India',
  grievanceOfficer: 'the Privacy Contact, The Shakti Multiversity',   // name a person here when one is appointed
  courtsCity: 'Dehradun, Uttarakhand',
  lastUpdated: '7 October 2026',
};

// "Complete Shiva Swarodaya" video series by Ma Shakti Devpriya.
export const swarodayaSeries = {
  english: 'https://www.youtube.com/playlist?list=PLXIZhgO2mfLviYHy3IDbuA08akAOt7nT2',
  hindi: '',   // playlist link to come (Tracker A-89); until then the Hindi button goes to the channel
  hindiChannel: 'https://www.youtube.com/SacredassociationOrg',
};

// Weekly sessions and dates: the "Publish to web" CSV link of the Google Sheet
// (see src/components/Sessions.astro for the columns). Leave '' until ready.
export const calendarSheetCsv = '';

// Student experiences, shown on the Home page once there is at least one.
// Only publish with the student's written permission. No health or cure claims.
export const experiences: { quote: string; name: string; place?: string }[] = [];

// Registration and contact forms (Tracker A-95). Paste the Web app URL of the
// Google Apps Script here (tools/google-apps-script/SETUP.md). Registrations are
// saved in Ma's Google Sheet and passed to Brevo for the course emails.
// Until it is filled in, the forms show a preview message and nothing is sent.
export const formEndpoint = '';
