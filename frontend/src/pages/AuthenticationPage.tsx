import { SignupForm } from "../components/forms/SignupForm";
import { LoginForm } from "../components/forms/LoginForm";

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';


// TO DO: Fix this page
export const AuthenticationPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <Tabs 
        aria-label="tabs" 
        defaultValue={0} sx={{ bgcolor: 'transparent' }}
      >
        <TabList
          disableUnderline
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: 'xl',
            bgcolor: 'background.level1',
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: 'sm',
              bgcolor: 'background.surface',
            },
          }}
        >
            <Tab disableIndicator>Sign up</Tab>
            <Tab disableIndicator>Log in</Tab>
          </TabList>
      </Tabs>

      <SignupForm />
      <LoginForm />
    </div>
  )
};