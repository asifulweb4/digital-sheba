export type FormField = {
  name: string
  label: string
  type: 'text' | 'date' | 'select' | 'textarea'
  placeholder: string
  required?: boolean
  options?: { label: string; value: string }[]
}

export const serviceFieldsConfig: Record<string, FormField[]> = {
  'server-copy': [
    { name: 'nidNumber', label: 'NID Number (এনআইডি নম্বর)', type: 'text', placeholder: 'যেমন: 1990XXXXXXXXXXXXX', required: true },
    { name: 'voterPin', label: 'Voter ID pin / Ration Number', type: 'text', placeholder: 'ভোটার পিন বা রেশন নম্বর', required: false },
    { name: 'nameBn', label: 'Name Bangla (নাম - বাংলা)', type: 'text', placeholder: 'বাংলায় আপনার নাম লিখুন', required: true },
    { name: 'nameEn', label: 'Name English (ইংরেজিতে CAPITAL LETTER)', type: 'text', placeholder: 'ENTER NAME IN ENGLISH', required: true },
    { name: 'fatherName', label: "Father's Name (পিতার নাম)", type: 'text', placeholder: 'পিতার নাম লিখুন', required: true },
    { name: 'motherName', label: "Mother's Name (মাতার নাম)", type: 'text', placeholder: 'মাতার নাম লিখুন', required: true },
    { name: 'dob', label: 'Date of Birth (DOB)', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
    { name: 'bloodGroup', label: 'Blood Group', type: 'select', placeholder: 'রক্তের গ্রুপ নির্বাচন করুন', options: [
      { label: 'A+ (Positive)', value: 'A+' }, { label: 'A- (Negative)', value: 'A-' },
      { label: 'B+ (Positive)', value: 'B+' }, { label: 'B- (Negative)', value: 'B-' },
      { label: 'O+ (Positive)', value: 'O+' }, { label: 'O- (Negative)', value: 'O-' },
      { label: 'AB+ (Positive)', value: 'AB+' }, { label: 'AB- (Negative)', value: 'AB-' },
    ], required: false },
    { name: 'photoUrl', label: 'Upload Photo URL (অথবা ফেস ফটো ফিলাপ করুন)', type: 'text', placeholder: 'https://...', required: false },
    { name: 'address', label: 'Full Permanent Address (ঠিকানা - ভোটার বিন্যাস অনুযায়ী)', type: 'textarea', placeholder: 'বিস্তারিত স্থায়ী ঠিকানা লিখুন', required: true },
  ],
  'sign-copy': [
    { name: 'voterNumber', label: 'ভোটার/আইডি নাম্বার', type: 'text', placeholder: 'ভোটার নাম্বার বা আইডি নাম্বার দিন', required: true },
  ],
  'nid-pdf': [
    { name: 'nidNumber', label: 'আইডি নাম্বার', type: 'text', placeholder: 'এনআইডি নাম্বার দিন', required: true },
    { name: 'dob', label: 'জন্ম তারিখ', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
  ],
  'birth-copy': [
    { name: 'birthRegNumber', label: 'জন্ম নিবন্ধন নাম্বার', type: 'text', placeholder: '১৭ ডিজিটের জন্ম নিবন্ধন নাম্বার দিন', required: true },
    { name: 'dob', label: 'জন্ম তারিখ', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
  ],
  'tin-certificate': [
    { name: 'nidNumber', label: 'আইডি কার্ড নাম্বার', type: 'text', placeholder: 'জাতীয় পরিচয়পত্র নাম্বার দিন', required: true },
  ],
  'tin-new': [
    { name: 'nidNumber', label: 'আইডি নাম্বার', type: 'text', placeholder: 'জাতীয় পরিচয়পত্র নাম্বার দিন', required: true },
    { name: 'fullName', label: 'পূর্ণ নাম', type: 'text', placeholder: 'আপনার পূর্ণ নাম দিন', required: true },
  ],
  'number-location': [
    { name: 'mobileNumber', label: 'মোবাইল নাম্বার', type: 'text', placeholder: '01XXXXXXXXX নাম্বার দিন', required: true },
  ],
  'nid-to-all-sim-info': [
    { name: 'nidNumber', label: 'NID কার্ড নাম্বার', type: 'text', placeholder: 'জাতীয় পরিচয়পত্র নাম্বার দিন', required: true },
  ],
  'mobile-to-nid': [
    { name: 'mobileNumber', label: 'মোবাইল নাম্বার', type: 'text', placeholder: '01XXXXXXXXX নাম্বার দিন', required: true },
  ],
  'land-service': [
    { name: 'daagNumber', label: 'দাগ নাম্বার', type: 'text', placeholder: 'দাগ নাম্বার দিন', required: true },
    { name: 'mouza', label: 'মৌজা ও জেলা', type: 'text', placeholder: 'মৌজা ও জেলা দিন', required: true },
  ]
}

// Fallback function to generate fields if not explicitly defined
export function getFieldsForService(serviceId: string, inputLabel: string, inputPlaceholder: string): FormField[] {
  if (serviceFieldsConfig[serviceId]) {
    return serviceFieldsConfig[serviceId]
  }

  // Generic fallback based on inputLabel
  return [
    {
      name: 'genericInput',
      label: inputLabel,
      type: 'text',
      placeholder: inputPlaceholder,
      required: true
    }
  ]
}
