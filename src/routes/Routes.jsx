import React, { lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserContext from '../Context/UserContext';
import { Loadable } from './../components/common/Loadable';

const Login = Loadable(lazy(() => import('../pages/Login')));
const Registration = Loadable(lazy(() => import('../pages/Registration')));
const TermOfUse = Loadable(
  lazy(() => import('../components/common/Footer/termOfUse'))
);
const PrivacyPolicy = Loadable(
  lazy(() => import('../components/common/Footer/privacyPolicy'))
);
const ConditionsOfSale = Loadable(
  lazy(() => import('../components/common/Footer/conditionsOfSale'))
);
const RegisterStep1 = Loadable(
  lazy(() => import('../pages/Registration/Steps/Step1'))
);
const Step1Verification = Loadable(
  lazy(() => import('../pages/Registration/Steps/Step1Verification'))
);

const PatiaentInformationStep = Loadable(
  lazy(() => import('../pages/Registration/Steps/PatientInformationStep'))
);
const HealthInsurance = Loadable(
  lazy(() => import('../pages/Registration/Steps/HealthInsurance'))
);
const InsuranceInformation = Loadable(
  lazy(() => import('../pages/Registration/Steps/InsuranceInformation'))
);
const SecondaryInsuranceInformation = Loadable(
  lazy(() =>
    import('../pages/Registration/Steps/SecondaryInsuranceInformation')
  )
);
const VerificationDirections = Loadable(
  lazy(() => import('../pages/Registration/Steps/VerificationDirections'))
);

const UsCareAct = Loadable(
  lazy(() => import('../pages/Registration/Steps/US-Cares-Act'))
);
const DriverLicenseFront = Loadable(
  lazy(() => import('../pages/Registration/Steps/DriverLicenseFront'))
);
const DriverLicenseBack = Loadable(
  lazy(() => import('../pages/Registration/Steps/DriverLicenseBack'))
);
const InsuranceCardFront = Loadable(
  lazy(() => import('../pages/Registration/Steps/InsuranceCardFront'))
);
const InsuranceCardBack = Loadable(
  lazy(() => import('../pages/Registration/Steps/InsuranceCardBack'))
);
const TestDependent = Loadable(
  lazy(() => import('../pages/Test/TestDependent'))
);

const CovidExposure = Loadable(
  lazy(() => import('../pages/Test/CovidExposure'))
);
const CovidSymptoms = Loadable(
  lazy(() => import('../pages/Test/CovidSymptoms'))
);
const CovidTestRequest = Loadable(
  lazy(() => import('../pages/Test/CovidTestRequest'))
);

//dependent
const Dependent = Loadable(lazy(() => import('../pages/Dependent')));
const AddDependent = Loadable(
  lazy(() => import('../pages/Dependent/AddDependent'))
);

const QRCode = Loadable(lazy(() => import('../pages/Test/QRCode')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const History = Loadable(lazy(() => import('../pages/History')));

export default function RouterComponent() {
  const [contextData, setContextData] = useState({ test: 'test' });

  return (
    <Router>
      <UserContext.Provider value={{ contextData, setContextData }}>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/verification/step1" element={<RegisterStep1 />} />
          <Route path="/verification/step2" element={<Step1Verification />} />

          <Route
            path="/PatientInformationStep"
            element={<PatiaentInformationStep />}
          />
          <Route path="/health-insurance" element={<HealthInsurance />} />
          <Route
            path="/insurance-information"
            element={<InsuranceInformation />}
          />
          <Route
            path="/secondary-insurance-information"
            element={<SecondaryInsuranceInformation />}
          />
          <Route
            path="/verification-directions"
            element={<VerificationDirections />}
          />
          <Route
            path="/driver-license-front"
            element={<DriverLicenseFront />}
          />
          <Route path="/driver-license-Back" element={<DriverLicenseBack />} />
          <Route
            path="/insurance-card-front"
            element={<InsuranceCardFront />}
          />
          <Route path="/insurance-card-back" element={<InsuranceCardBack />} />
          <Route path="/test-dependent" element={<TestDependent />} />
          <Route path="/covid-exposure" element={<CovidExposure />} />
          <Route path="/covid-symptoms" element={<CovidSymptoms />} />
          <Route path="/covid-test-request" element={<CovidTestRequest />} />
          <Route path="/QR-Code" element={<QRCode />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/edit-profile" element={<PatiaentInformationStep />} />
          <Route path="/edit-insurance" element={<HealthInsurance />} />

          <Route path="/UsCareAct" element={<UsCareAct />} />

          {/* dependent */}
          <Route path="/dependents" element={<Dependent />} />
          <Route path="/add-dependents" element={<AddDependent />} />

          <Route path="/terms-of-use" element={<TermOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/conditions-of-sale" element={<ConditionsOfSale />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}
