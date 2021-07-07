import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert, Brand,
  Page, PageHeader, PageHeaderTools, PageSection,
  PageSidebar, Title, AlertActionCloseButton,
} from "@patternfly/react-core";
import { UserAltIcon } from "@patternfly/react-icons";

import classNames from "classnames";
import { getTitle } from "../components/title";
import ClientPages from "./client-pages";
import { OpenShiftUserContext, InConsoleContext } from "../contexts";
import { AlertInfo, ConnectorAlertContext } from "./global-alert-context";

export function BasePage({ title, content: Content }: { title: string, content: React.ComponentType<any> }): JSX.Element {
  const [ isNavOpen, setIsNavOpen ] = useState(false);

  const [ alerts, setAlerts ] = useState<AlertInfo[]>([]);

  const inConsole = useContext(InConsoleContext);
  const { user } = useContext(OpenShiftUserContext);

  if (inConsole) {
    return (
      <Content />
    );
  }

  return (
    <>
      {getTitle(title)}

      <Page
        mainContainerId="page-container"
        header={
          <PageHeader
            logo={
              <div className="center-y">
                <Brand alt="OpenShift logo" src="/img/openshift.svg" style={{ height: "2.5rem" }}/>
              </div>
            }
            logoProps={{
              href: "/",
            }}
            headerTools={
              <PageHeaderTools>
                <Link to={ClientPages.User.path} className="hover-box p-2 text-white center-y" >
                  <div className="me-3">
                    {user.name}
                  </div>
                  <UserAltIcon style={{ fontSize: "2rem" }}/>
                </Link>
              </PageHeaderTools>
            }
            showNavToggle
            isNavOpen={isNavOpen}
            onNavToggle={() => setIsNavOpen(!isNavOpen)}
          />
        }
        sidebar={
          <PageSidebar
            nav={
              <>
                <Title headingLevel="h3">Navigation</Title>
              </>
            }

            isNavOpen={isNavOpen}
          />
        }>
        <ConnectorAlertContext.Provider value={(newAlert: AlertInfo) => setAlerts([ ...alerts, newAlert ])}>
          <PageSection id="page-content">
            <Content />
          </PageSection>
          <div id="notifications" className={classNames({ "d-none": alerts.length === 0 })} >
            {
              alerts.map((alert, i) => (
                <Alert key={i} variant={alert.severity} title={alert.title}
                  timeout={10000}
                  onTimeout={() => {
                    const alertsCopy = [ ...alerts ];
                    alertsCopy.splice(i, 1);
                    setAlerts(alertsCopy);
                  }}
                  actionClose={
                    <AlertActionCloseButton
                      onClose={() => {
                        const alertsCopy = [ ...alerts ];
                        alertsCopy.splice(i, 1);
                        setAlerts(alertsCopy);
                      }}
                    />
                  }
                >
                  {alert.body ? <p>{alert.body}</p> : ""}
                </Alert>
              ))
            }
          </div>
        </ConnectorAlertContext.Provider>
      </Page>
    </>
  );
}