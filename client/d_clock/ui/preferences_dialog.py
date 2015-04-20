import base64
import json
import urllib
import urllib2

from PySide.QtCore import Qt
from PySide.QtGui import (QDialog, QTabWidget, QVBoxLayout, QWidget,
                          QFormLayout, QLineEdit, QCheckBox, QGroupBox,
                          QPushButton, QMessageBox)

from d_clock.config import Config


class PreferencesDialog(QDialog):
    """ A dialog to allow the user to configure the application.

    """
    def __init__(self, *args, **kwargs):
        """ Initialize the Preferences dialog.

        """
        super(PreferencesDialog, self).__init__(*args, **kwargs)
        self.setup_ui()

    def setup_ui(self):
        """ Construct the UI for the dialog.

        """
        tab_widget = QTabWidget()

        general_widget = QWidget()
        general_layout = QVBoxLayout()

        general_layout.addWidget(self.setup_general_server_group())
        general_widget.setLayout(general_layout)
        tab_widget.addTab(general_widget, 'General')

        layout = QVBoxLayout()
        layout.addWidget(tab_widget)
        self.setLayout(layout)

    def setup_general_server_group(self):
        """ Setup the 'Server' group in the 'General' tab.

        Returns:
        --------
        A QGroupBox widget

        """
        general_server_group = QGroupBox('Server')
        general_server_layout = QFormLayout()
        general_server_layout.setFieldGrowthPolicy(
            QFormLayout.AllNonFixedFieldsGrow)

        email, password = self.auth_credentials()

        self.email_edit = QLineEdit(email)
        self.email_edit.textChanged.connect(self.update_auth)
        general_server_layout.addRow('Email', self.email_edit)

        self.password_edit = QLineEdit(password)
        self.password_edit.setEchoMode(QLineEdit.Password)
        self.password_edit.textChanged.connect(self.update_auth)
        general_server_layout.addRow('Password', self.password_edit)

        show_password_widget = QCheckBox()
        show_password_widget.stateChanged.connect(self.on_show_password_toggle)
        general_server_layout.addRow('Show password', show_password_widget)

        test_authentication_button = QPushButton('Test Authentication')
        test_authentication_button.clicked.connect(self.on_test_authentication)
        general_server_layout.addRow(test_authentication_button)

        general_server_group.setLayout(general_server_layout)
        return general_server_group

    def update_auth(self):
        """ Handler to update the configuration object with the values
        in the email and password fields.

        """
        email = self.email_edit.text()
        password = self.password_edit.text()
        auth = '%s:%s' % (email, password)

        Config.set('WS_AUTH', base64.b64encode(auth.encode('utf8')))

    def auth_credentials(self):
        """ Get the current authentication credentials stored in the
        configuration.

        Returns:
        --------
        A 2-tuple of (email, password). If the credentials don't exist, the
        email and password will both be empty strings.

        """
        auth = base64.b64decode(Config.get('WS_AUTH', ''))
        if ':' in auth:
            return auth.split(':')

        return '', ''

    def on_show_password_toggle(self, state):
        """ Handler for state change on the show password checkbox.

        Parameters:
        -----------
        state : Qt.CheckState
            The new state of the checkbox

        """
        mode = QLineEdit.Normal if state == Qt.Checked else QLineEdit.Password
        self.password_edit.setEchoMode(mode)

    def on_test_authentication(self):
        """ Handler for the clicked signal of the 'Test Authentication' button.

        """
        email = self.email_edit.text()
        password = self.password_edit.text()

        url = Config.get('AUTH_URL')

        if url is not None:
            data = {
                'email': email,
                'password': password
            }
            request = urllib2.Request(url, urllib.urlencode(data))

            try:
                response = json.loads(urllib2.urlopen(request).read())
                status = response.get('status')

                if status is None:
                    QMessageBox.about(self, 'Server error',
                                      'Invalid response from server')

                elif status == 'error':
                    QMessageBox.about(self, 'Server error',
                                      'An unknown server error has occurred')

                elif status:
                    QMessageBox.about(self, 'Success',
                                      'Successfully authenticated!')

                else:
                    QMessageBox.about(self, 'Fail',
                                      'Authentication failed')

            except urllib2.HTTPError:
                QMessageBox.about(self, 'Server error',
                                  'Unable to contact authentication server')

        else:
            QMessageBox.about(self, 'No server',
                              'No authentication server provided')
