import React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import {
  FaAngleRight,
  FaArrowDown,
  FaArrowUp,
  FaAsterisk,
  FaCopy,
  FaGithub,
  FaInfoCircle,
  FaPlus,
  FaSave,
  FaStar,
  FaTrashAlt,
} from "react-icons/fa";
import "./App.css";
import redirectImage from "./redirect.webp";

import "bootstrap/dist/css/bootstrap.min.css";
import copy from "copy-to-clipboard";
import { useLocalStorage } from "react-storage-complete";
import { useMomentaryBool } from "react-use-precision-timer";
import { HelpAccordion } from "./HelpAccordion";

export const RedirectorSetup = () => {
  const [hideGreeting, setHideGreeting] = useLocalStorage<boolean>(
    "hideGreeting",
    false
  );
  const [redirects, setRedirects] = useLocalStorage<string[]>("redirects", []);
  const [enteredRedirect, setEnteredRedirect] = React.useState("");
  const [copied, toggleCopied] = useMomentaryBool(false, 1500);
  const [imported, toggleImported] = useMomentaryBool(false, 1500);
  const redirectFieldRef = React.useRef<HTMLInputElement | null>(null);
  const redirectsTextAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [importError, setImportError] = React.useState("");

  const handleAddRedirect = () => {
    const val = enteredRedirect.trim();
    if (val) {
      const newRedirects = [...(redirects ?? []), enteredRedirect.trim()];
      setRedirects(newRedirects);
      setEnteredRedirect("");
    }
  };

  const handleDeleteRedirect = (index: number) => {
    if (index >= 0 && index < (redirects ?? []).length) {
      const newRedirects = [...(redirects ?? [])];
      newRedirects.splice(index, 1);
      setRedirects(newRedirects);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0 && index < (redirects ?? []).length) {
      const newRedirects = [...(redirects ?? [])];
      const removed = newRedirects.splice(index, 1);
      newRedirects.splice(index - 1, 0, ...removed);
      setRedirects(newRedirects);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index >= 0 && index < (redirects ?? []).length - 1) {
      const newRedirects = [...(redirects ?? [])];
      const removed = newRedirects.splice(index, 1);
      newRedirects.splice(index + 1, 0, ...removed);
      setRedirects(newRedirects);
    }
  };

  const handleCopy = () => {
    copy(JSON.stringify(redirects));
    toggleCopied();
  };

  const handleImport = () => {
    setImportError("");
    navigator.clipboard
      .readText()
      .then((text) => {
        try {
          const importedRedirects = JSON.parse(text);
          if (Array.isArray(importedRedirects)) {
            const newRedirects = importedRedirects.filter(
              (v) => typeof v === "string"
            );
            setRedirects(newRedirects);
            toggleImported();
          } else {
            setImportError(
              `The data you provided was not valid. To import redirects, you must copy the REDIRECTS environment variable value from your existing Netlify site.`
            );
          }
        } catch (e) {
          console.error(e);
          setImportError(
            `The data you provided was not valid. To import redirects, you must copy the REDIRECTS environment variable value from your existing Netlify site. ${e}`
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setImportError(`Sorry, there was an error reading the clipboard. ${e}`);
      });
  };

  const redirectElements = (redirects ?? []).map((r, i, arr) => {
    return (
      <ListGroup.Item
        key={`redirect-${i}`}
        className="d-flex gap-4 justify-content-between align-items-center fw-bold"
        style={{ background: "#FAFAFF" }}
      >
        <code className="text-primary text-break">{r}</code>
        <div className="d-flex gap-4">
          <div className="d-flex gap-2">
            <FaArrowUp
              className={`cursor-pointer ${i === 0 ? "invisible" : ""}`}
              onClick={() => handleMoveUp(i)}
            />
            <FaArrowDown
              className={`cursor-pointer ${
                i >= arr.length - 1 ? "invisible" : ""
              }`}
              onClick={() => handleMoveDown(i)}
            />
          </div>
          <FaTrashAlt
            className="cursor-pointer"
            onClick={() => handleDeleteRedirect(i)}
          />
        </div>
      </ListGroup.Item>
    );
  });

  const redirectsCount = (redirects ?? []).length;

  return (
    <div className="App pt-5">
      <Navbar bg="light" variant="light" className="shadow-sm fixed-top">
        <Container>
          <Navbar.Brand href="/">
            <div className="d-flex gap-2 align-items-center">
              <img
                src={redirectImage}
                alt="Arrow pointing to the right"
                style={{ height: 30 }}
              />
              Netlify Redirector
            </div>
          </Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link
              href="https://github.com/justinmahar/netlify-domain-redirector"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="mb-1" />
            </Nav.Link>
            <Nav.Link
              href="https://github.com/justinmahar/netlify-domain-redirector/stargazers"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star It &rarr; <FaStar className="mb-1" />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="my-5">
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            {!hideGreeting && (
              <Alert
                variant="info"
                dismissible
                onClose={() => setHideGreeting(true)}
              >
                <h3>Welcome to Netlify Redirector!</h3>
                <p>Below you can set up the redirects for your Netlify site.</p>
                <p className="mb-0">
                  {" "}
                  If you find this project helpful, please{" "}
                  <a
                    href="https://github.com/justinmahar/netlify-domain-redirector/stargazers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Star it on GitHub
                  </a>{" "}
                  so others can find it. :) Enjoy!
                </p>
              </Alert>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <h3>Setup </h3>
              {hideGreeting && (
                <FaInfoCircle
                  className="text-info cursor-pointer"
                  onClick={() => setHideGreeting(false)}
                />
              )}
            </div>
            <div className="d-flex flex-column gap-3">
              <div>
                <Card>
                  <Card.Header>
                    <FaAsterisk className="mb-1" /> Create Redirects
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-3">
                    <div>
                      <div className="d-flex flex-column gap-2">
                        <Card>
                          <Card.Header>
                            Your Redirects{" "}
                            <Badge
                              bg={redirectsCount > 0 ? "primary" : "dark"}
                              pill
                              className="ms-2"
                            >
                              {redirectsCount}
                            </Badge>
                          </Card.Header>
                          <Card.Body className="p-0">
                            <ListGroup
                              style={{
                                borderStartStartRadius: 0,
                                borderStartEndRadius: 0,
                              }}
                            >
                              {redirectElements.length === 0 && (
                                <ListGroup.Item className="fst-italic small">
                                  There are no redirects. Add a redirect below.
                                </ListGroup.Item>
                              )}
                              {redirectElements}
                            </ListGroup>
                          </Card.Body>
                        </Card>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddRedirect();
                          }}
                        >
                          <Form.Group
                            controlId="new-redirect-id"
                            className="d-flex gap-2"
                          >
                            <Form.Control
                              ref={redirectFieldRef}
                              type="text"
                              placeholder="Enter redirect"
                              value={enteredRedirect}
                              onChange={(e) =>
                                setEnteredRedirect(e.target.value)
                              }
                              onFocus={() => redirectFieldRef.current?.select()}
                              className="font-monospace"
                            />
                            <Button
                              type="submit"
                              variant={
                                enteredRedirect ? "primary" : "outline-primary"
                              }
                              onClick={() => console.log("Add")}
                            >
                              <FaPlus className="mb-1" />
                            </Button>
                          </Form.Group>
                          <Form.Text className="text-muted">
                            Refer to the{" "}
                            <a
                              href="https://docs.netlify.com/routing/redirects/redirect-options/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Netlify redirect options
                            </a>{" "}
                            for how to configure redirects.
                          </Form.Text>
                        </Form>
                      </div>
                    </div>
                    <HelpAccordion />
                  </Card.Body>
                </Card>
              </div>
              <div>
                <Card>
                  <Card.Header>
                    <FaSave className="mb-1" /> Save Redirects to Netlify
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <p className="mb-0">
                      When you are happy with your redirects, follow these steps
                      to save and activate them in Netlify:
                    </p>
                    <ol className="mb-0">
                      <li>
                        Open{" "}
                        <a
                          href="https://netlify.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Netlify
                        </a>{" "}
                        and open your Netlify Redirector site.
                      </li>
                      <li>
                        Open Site configuration{" "}
                        <FaAngleRight style={{ marginBottom: 2 }} /> Environment
                        variables.
                      </li>
                      <li>
                        Copy the value below and set the environment variable{" "}
                        <code className="text-primary">REDIRECTS</code> to this
                        value.
                      </li>
                      <li>Open Deploys and trigger a deploy.</li>
                    </ol>
                    <Form.Group controlId="redirects-env-value">
                      <Form.Label className="fw-bold small">
                        Your <code className="text-primary">REDIRECTS</code>{" "}
                        environment variable value:
                      </Form.Label>
                      <Form.Control
                        ref={redirectsTextAreaRef}
                        as="textarea"
                        rows={3}
                        value={JSON.stringify(redirects)}
                        readOnly
                        className="font-monospace"
                        onFocus={() => redirectsTextAreaRef.current?.select()}
                      />
                    </Form.Group>
                    <div className="d-flex gap-1">
                      <Button
                        variant={redirectsCount > 0 ? "primary" : "secondary"}
                        onClick={handleCopy}
                      >
                        {copied ? (
                          "Copied!"
                        ) : (
                          <>
                            <FaCopy className="mb-1" /> Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleImport}
                      >
                        {imported ? "Imported!" : "Import From Clipboard"}
                      </Button>
                    </div>
                    {importError && (
                      <Alert
                        variant="danger"
                        dismissible
                        className="mb-0"
                        onClose={() => setImportError("")}
                      >
                        <p className="mb-0">{importError}</p>
                      </Alert>
                    )}
                    <Alert variant="info" className="mt-4 mb-0">
                      <p>
                        After your deploy has finished, your redirects will be
                        active.
                      </p>
                      <p className="mb-0">
                        You can then assign a domain to the site in Netlify
                        after you confirm the redirects are working as expected.
                      </p>
                    </Alert>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
