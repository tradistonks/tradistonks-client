import React from 'react';
import GitHubLogin from 'react-github-login';
import { Button, Icon } from 'semantic-ui-react';

import { CONFIG } from '../../config/config';

import styles from './GithubSignin.module.scss';

type GithubSigninProps = {
  inverted?: boolean;
};

const GithubSignin = ({ inverted }: GithubSigninProps) => {
  const ref = React.createRef<{ onBtnClick: () => unknown }>();

  const onClick = () => {
    ref?.current?.onBtnClick();
  };

  return (
    <>
      <Button inverted={inverted} onClick={onClick}>
        <Icon name="github" inverted={inverted} />
        Sign in
      </Button>
      <GitHubLogin
        clientId={CONFIG.auth.clientId}
        redirectUri={CONFIG.auth.redirectUri}
        onSuccess={(res: unknown) => console.log(res)}
        onFailure={(res: unknown) => console.log(res)}
        className={styles.hidden}
        ref={ref}
      />
    </>
  );
};

export default GithubSignin;
