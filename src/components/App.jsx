import { Component } from "react";
import { ContactForm } from "./ContactForm/ContactForm";
import { ContactList } from "./ContactList/ContactList";
import { Container } from "./Container/Container";
import { Section } from "./Section/Section";
import { FindContacts } from "./FindContacts/FindContacts";
import Notiflix from "notiflix";
import { nanoid } from 'nanoid';
import contacts from '../contacts.json';

export class App extends Component {
  state = {
    contacts: contacts,
    filter: '',
  };

  componentDidMount() {
    const SavedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (SavedContacts !== null) {
      this.setState({ contacts: SavedContacts });
    } else {
      this.setState({ contacts })
    }
  };

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  };

  addContact = (value, name) => {
    if (this.state.contacts.some(value => value.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      Notiflix.Notify.failure(`${name} is already in contacts!`);
    } else {
      const newContact = {...value, id: nanoid()}
      this.setState(prevState => ({
        contacts: [newContact, ...prevState.contacts],
      }))
    }
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(item => item.id !== id),
    }))
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value })
  };

  render() {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    const visibleContacts = contacts.filter(item => item.name.toLowerCase().includes(normalizedFilter));
    
    return (
    <Container>
      <Section title="Phonebook">
          <ContactForm onSave={this.addContact} />
      </Section>
        <Section title="Contacts">
          <FindContacts value={filter} onChange={this.changeFilter} />
        <ContactList contacts={visibleContacts} onDelete={this.deleteContact} />
      </Section>
    </Container>
  );
  };
};