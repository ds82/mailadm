--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: mail; Type: DATABASE; Schema: -; Owner: dennis
--

CREATE DATABASE mail WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE mail OWNER TO dennis;

\connect mail

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: access; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE access (
    email character varying(128),
    action character varying(50)
);


ALTER TABLE public.access OWNER TO dennis;

--
-- Name: blocked; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE blocked (
    destination character varying(100) NOT NULL,
    domain character varying(100),
    action character varying(50)
);


ALTER TABLE public.blocked OWNER TO dennis;

--
-- Name: domains; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE domains (
    domain character varying(128) DEFAULT ''::character varying NOT NULL,
    parent character varying(128)
);


ALTER TABLE public.domains OWNER TO dennis;

--
-- Name: forward; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE forward (
    source character varying(80) NOT NULL,
    enable_greylisting boolean DEFAULT false,
    enable_policyd boolean DEFAULT false,
    destination character varying(80)[]
);


ALTER TABLE public.forward OWNER TO dennis;

--
-- Name: transport; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE transport (
    domain character varying(128) DEFAULT ''::character varying NOT NULL,
    transport character varying(128) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.transport OWNER TO dennis;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dennis; Tablespace: 
--

CREATE TABLE users (
    email character varying(80) NOT NULL,
    password character varying(32) NOT NULL,
    enabled boolean,
    is_admin boolean,
    domains character varying(128)[],
    maildir character varying(100),
    alias character varying(100),
    domain character varying(100),
    access character varying(200)[]
);


ALTER TABLE public.users OWNER TO dennis;

--
-- Name: destination; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY blocked
    ADD CONSTRAINT destination PRIMARY KEY (destination);


--
-- Name: domains_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY domains
    ADD CONSTRAINT domains_pkey PRIMARY KEY (domain);


--
-- Name: domainunique; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY domains
    ADD CONSTRAINT domainunique UNIQUE (domain);


--
-- Name: fieldomainunique; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY transport
    ADD CONSTRAINT fieldomainunique UNIQUE (domain);


--
-- Name: forwardings_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY forward
    ADD CONSTRAINT forwardings_pkey PRIMARY KEY (source);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: blocked; Type: ACL; Schema: public; Owner: dennis
--

REVOKE ALL ON TABLE blocked FROM PUBLIC;
REVOKE ALL ON TABLE blocked FROM dennis;
GRANT ALL ON TABLE blocked TO dennis;
GRANT SELECT ON TABLE blocked TO PUBLIC;
GRANT SELECT ON TABLE blocked TO mail;


--
-- Name: domains; Type: ACL; Schema: public; Owner: dennis
--

REVOKE ALL ON TABLE domains FROM PUBLIC;
REVOKE ALL ON TABLE domains FROM dennis;
GRANT ALL ON TABLE domains TO dennis;
GRANT SELECT ON TABLE domains TO mail;


--
-- Name: forward; Type: ACL; Schema: public; Owner: dennis
--

REVOKE ALL ON TABLE forward FROM PUBLIC;
REVOKE ALL ON TABLE forward FROM dennis;
GRANT ALL ON TABLE forward TO dennis;
GRANT SELECT ON TABLE forward TO mail;


--
-- Name: transport; Type: ACL; Schema: public; Owner: dennis
--

REVOKE ALL ON TABLE transport FROM PUBLIC;
REVOKE ALL ON TABLE transport FROM dennis;
GRANT ALL ON TABLE transport TO dennis;
GRANT SELECT ON TABLE transport TO mail;


--
-- Name: users; Type: ACL; Schema: public; Owner: dennis
--

REVOKE ALL ON TABLE users FROM PUBLIC;
REVOKE ALL ON TABLE users FROM dennis;
GRANT ALL ON TABLE users TO dennis;
GRANT SELECT ON TABLE users TO mail;


--
-- PostgreSQL database dump complete
--

