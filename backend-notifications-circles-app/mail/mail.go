package mail

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"text/template"

	mandrill "github.com/keighl/mandrill"

	strip "github.com/grokify/html-strip-tags-go"
)

// Mail ...
type Mail struct {
	Title            string
	ToName           string
	ToEmail          string
	FromEmail        string
	FromName         string
	Template         string
	HTMLContent      string
	PlaintextContent string
	Data             Content
}

// Content ...
type Content struct {
	VerifyCode int32
}

// Send ...
func Send(options ...Option) error {
	m := &Mail{}
	for _, o := range options {
		if err := o(m); err != nil {
			return err
		}
	}
	if err := m.parseTemplate(); err != nil {
		return err
	}

	client := mandrill.ClientWithKey(os.Getenv("MANDRILL"))
	message := &mandrill.Message{}
	message.AddRecipient(m.ToEmail, m.ToName, "to")
	message.FromEmail = m.FromEmail
	message.FromName = m.FromName
	message.Subject = m.Title
	message.HTML = m.HTMLContent
	message.Text = m.PlaintextContent

	res, err := client.MessagesSend(message)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	log.Println("Mandrill sent", res)
	return nil
}

func (m *Mail) parseTemplate() error {
	path := fmt.Sprintf("mail_templates/%s.html", m.Template)
	tpl, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	t, err := template.New("mail").Parse(string(tpl))
	if err != nil {
		return err
	}
	var out bytes.Buffer
	err = t.Execute(&out, m.Data)
	if err != nil {
		return err
	}
	m.HTMLContent = out.String()
	m.PlaintextContent = strip.StripTags(m.HTMLContent)
	return nil
}
