package mail

// Option ...
type Option func(*Mail) error

// To ...
func To(n string, e string) Option {
	return func(m *Mail) error {
		m.ToName = n
		m.ToEmail = e
		return nil
	}
}

// Title ...
func Title(t string) Option {
	return func(m *Mail) error {
		m.Title = t
		return nil
	}
}

// FromEmail ...
func FromEmail(t string) Option {
	return func(m *Mail) error {
		m.FromEmail = t
		return nil
	}
}

// FromName ...
func FromName(t string) Option {
	return func(m *Mail) error {
		m.FromName = t
		return nil
	}
}

// Template ...
func Template(t string, data Content) Option {
	return func(m *Mail) error {
		m.Template = t
		m.Data = data
		return nil
	}
}
