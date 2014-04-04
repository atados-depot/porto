(function(angular, undefined) {
	 angular.module("atadosConstants", [])

.constant("ENV", "development")

.constant("api", "http://www.atadoslocal.com.br:8000/v1/")

.constant("authApi", "http://www.atadoslocal.com.br:9000/auth/client")

.constant("storage", "http://www.atadoslocal.com.br:8000/static/images/")

.constant("selected", "http://www.atadoslocal.com.br:8000/static/images/heart.png")

.constant("notselected", "http://www.atadoslocal.com.br:8000/static/images/blue.png")

.constant("facebookClientId", "430973993601792")

.constant("locale", "pt_BR")

.constant("accessTokenCookie", "access_token")

.constant("csrfCookie", "csrftoken")

.constant("sessionIdCookie", "sessionid")

.constant("grantType", "password")

.constant("page_size", 30)

.constant("active_cities", 4)

.constant("static_page_size", 300)

.constant("weekdays", [
  {
    "1": "Segunda"
  },
  {
    "2": "Terça"
  },
  {
    "3": "Quarta"
  },
  {
    "4": "Quinta"
  },
  {
    "5": "Sexta"
  },
  {
    "6": "Sabado"
  },
  {
    "7": "Domingo"
  }
])

.constant("periods", [
  {
    "0": "Manha"
  },
  {
    "1": "Tarde"
  },
  {
    "2": "Noite"
  }
])

.constant("defaultZoom", 11)

.constant("VOLUNTEER", "VOLUNTEER")

.constant("NONPROFIT", "NONPROFIT")

; 
})(angular);