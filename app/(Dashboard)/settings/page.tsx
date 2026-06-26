// 'use client'

// import { useState } from 'react'
// import BusinessTab from './components/BusinessTab'
// import { AccountTab } from './components/AccountTab'
// import { InvoiceTab } from './components/InvoiceTab'

// const tabs = [
//   { id: 'business', label: 'Business Profile' },
//   { id: 'invoice', label: 'Invoice Settings' },
//   { id: 'account', label: 'Account' },
// ]

// const Page = () => {
//   const [activeTab, setActiveTab] = useState('business')

//   return (
//     <div className=" mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Settings</h1>

//       {/* Tabs */}
//       <div className="border-b flex gap-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`pb-3 text-sm font-medium transition relative ${
//               activeTab === tab.id
//                 ? 'text-primary'
//                 : 'text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             {tab.label}

//             {/* Underline */}
//             {activeTab === tab.id && (
//               <span className="absolute left-0 bottom-0 h-[2px] w-full bg-primary rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div className="mt-6">
//         {activeTab === 'business' && <BusinessTab />}
//         {activeTab === 'invoice' && <InvoiceTab />}
//         {activeTab === 'account' && <AccountTab />}
//       </div>
//     </div>
//   )
// }

// export default Page

'use client'

import { useState } from 'react'
import BusinessTab from './components/BusinessTab'
import { AccountTab } from './components/AccountTab'
import { InvoiceTab } from './components/InvoiceTab'
import { TeamTab } from './components/TeamTab'

const tabs = [
  { id: 'business', label: 'Business Profile' },
  { id: 'invoice', label: 'Invoice Settings' },
  { id: 'team', label: 'Team' },
  { id: 'account', label: 'Account' },
]

const Page = () => {
  const [activeTab, setActiveTab] = useState('business')

  return (
    <div className=" mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="border-b flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}

            {/* Underline */}
            {activeTab === tab.id && (
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'business' && <BusinessTab />}
        {activeTab === 'invoice' && <InvoiceTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'account' && <AccountTab />}
      </div>
    </div>
  )
}

export default Page
