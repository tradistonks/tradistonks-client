import React from 'react';
import {
  Container,
  Header as SemanticHeader,
  Menu,
  Segment,
} from 'semantic-ui-react';
import GithubSignin from './atoms/GithubSignin';

const Header = () => {
  return (
    <>
      <Segment inverted textAlign="center" vertical>
        <Menu inverted pointing secondary size="large">
          <Container>
            <Menu.Item position="left">
              <SemanticHeader as="h2" inverted>
                Tradistonks
              </SemanticHeader>
            </Menu.Item>
            <Menu.Item as="a" active>
              Home
            </Menu.Item>
            <Menu.Item as="a">Link1</Menu.Item>
            <Menu.Item as="a">Link2</Menu.Item>
            <Menu.Item as="a">Link3</Menu.Item>
            <Menu.Item position="right">
              <GithubSignin inverted />
            </Menu.Item>
          </Container>
        </Menu>
      </Segment>
    </>
  );
};

export default Header;
