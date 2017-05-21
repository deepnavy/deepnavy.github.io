---
layout:     post
title:      Используем Python для доступа к данным Всемирного банка
date:       2017-05-17
minutes:    8
image: /assets/plot.png
---
<!--more-->
Одной из наиболее компетентных международных организаций в сфере открытых данных является Всемирный банк. На сайте организации представлены сотни наборов данных, которые касаются практически всех сфер деятельности человека: сельское хозяйство и развитие сельских районов, эффективность помощи ВБ, изменение климата, экономика и развитие, образование, энергетика и горнодобывающая промышленность, окружающая среда, внешняя задолженность стран, финансовый сектор, население, здравоохранение, инфраструктура, бедность, частный сектор, государственный сектор, наука и технологии, социальное развитие, рынок труда, торговля, развитие городской инфраструктуры и многое другое.

Сам сайт Всемирного банка в разделе Data предоставляет много инструментов для визуализации и анализа данных. Информация сортируется по странам и индикаторам. Все очень удобно и наглядно. Но для более серьезных вещей, нужно получить более гибкий доступ к наборам данным. Тут на помощь приходит API.

В этом примере, я буду использовать интерактивную оболочку iPython (python 2.7) и библиотеку wbdata для доступа к API Всемирного банка.

In[1]:
{% highlight python %}
import wbdata
import pandas
from datetime import datetime
import matplotlib.pyplot as plt

# поиск индикаторов по определенному слову
wbdata.search_indicators('time required')
{% endhighlight %}

Out[1]:
<pre>
IC.FRM.DURS   	Time required to obtain an operating license (days)
IC.ELEC.TIME  	Time required to get electricity (days)
IC.ELC.TIME   	Time required to get electricity (days)
IC.EC.TIME    	Time required to enforce a contract (days)
IC.DCP.TIME   	Time required to build a warehouse (days)
IC.WRH.DURS   	Time required to build a warehouse (days)
IC.RP.TIME    	Time required to register property (days)
IC.REG.DURS.MA	Time required to start a business, male (days)
IC.REG.DURS.FE	Time required to start a business, female (days)
IC.REG.DURS   	Time required to start a business (days)
IC.PRP.DURS   	Time required to register property (days)
IC.LIC.TIME   	Time required to build a warehouse (days)
IC.LGL.DURS   	Time required to enforce a contract (days)
IC.GE.TIME    	Time required to connect to electricity (days)
IC.FRM.TIME   	Time required to deal with construction permits (days)
</pre>

Выбираем индикаторы - возьмем что-то с позитивной тенденцией.

In[2]:
{% highlight python %}
# в словаре ключи - это нужные нам индикаторы, а значения - имя столбца
indicators = {'IC.REG.DURS': 'Time required to start a business', 'IC.PRP.DURS': 'Time required to register property'} 

# задаем временной интервал
start = datetime.strptime('2003', '%Y')
end = datetime.strptime('2016', '%Y')

# страны в ISO 3
countries = ['UKR']

# загружаем данные сразу в pandas DataFrame
df = wbdata.get_dataframe(indicators=indicators, country='UKR', data_date=(start, end), convert_date=False)

# сортируем для правильного построения графика
dfr = df.iloc[::-1]

# рисуем график
dfr.plot()
plt.ylabel('Days')
plt.xlabel('Date')
plt.title('Ukrainian reforms positive impact')
plt.savefig('plot.png', dpi=150)
{% endhighlight %}

Out[2]:
![Ukranian reforms positive impact](/assets/plot22.png)

Теперь сравним показатели нескольких стран по одному индикатору.

In[3]:
{% highlight python %}
# все также используем стандартизацию ISO 3
# если точно не знаем код страны, то ищем
wbdata.search_countries('latvia') #out: LVA	Latvia

countries = ['RUS', 'POL', 'GEO', 'LVA', 'UKR']

indicators = {'IC.REG.DURS': 'Time required to start a business (days)'}

df = wbdata.get_dataframe(indicators, country=countries, data_date=(start, end), convert_date=False)

# поворачиваем таблицу для лучшей визуализации
dfu = df.unstack(level=0)

 # рисуем график
dfu.plot()
plt.legend(loc='best');

# делаем легенду лаконичнее
column_names = list(dfu.columns.values)
plt.legend(zip(*column_names)[1])

plt.xlabel('Date')
plt.ylabel('Days')
plt.title('Time required to start a business')
plt.savefig('plot.png', dpi=150)
{% endhighlight %}

Out[3]:
![Time required to start a business](/assets/plot.png)

Еще полезные функции в модуле wbdata: 


In[4]: 
{% highlight python %}
# получаем полную информация о стране в формате json
wbdata.get_country('UKR', display=False) 
{% endhighlight %}

Out[4]:
{% highlight javascript %}
[{u'adminregion': {u'id': u'ECA',
   u'value': u'Europe & Central Asia (excluding high income)'},
  u'capitalCity': u'Kiev',
  u'id': u'UKR',
  u'incomeLevel': {u'id': u'LMC', u'value': u'Lower middle income'},
  u'iso2Code': u'UA',
  u'latitude': u'50.4536',
  u'lendingType': {u'id': u'IBD', u'value': u'IBRD'},
  u'longitude': u'30.5038',
  u'name': u'Ukraine',
  u'region': {u'id': u'ECS', u'value': u'Europe & Central Asia'}}]
{% endhighlight %}

Информацию о классификации стран по уровню дохода:

{% highlight python %}
wbdata.get_incomelevel() 
{% endhighlight %}

<pre>
HIC	High income
INX	Not classified
LIC	Low income
LMC	Lower middle income
LMY	Low & middle income
MIC	Middle income
UMC	Upper middle income
</pre>

Также можно получить список стран с определенным уровнем дохода и использовать его в последующем анализе.

In[6]:
{% highlight python %}
# преобразование json в pandas
from pandas.io.json import json_normalize

df = json_normalize(wbdata.get_country(incomelevel='LIC', display=False))

# чистим таблицу, выбираем, что нам нужно
dfc = df[['name', 'id', 'capitalCity', 'region.value']]  

dfc.head()
{% endhighlight %}

Out[6]:

<pre>
name   id  capitalCity         region.value
0               Afghanistan  AFG        Kabul           South Asia
1                   Burundi  BDI    Bujumbura  Sub-Saharan Africa 
2                     Benin  BEN   Porto-Novo  Sub-Saharan Africa 
3              Burkina Faso  BFA  Ouagadougou  Sub-Saharan Africa 
4  Central African Republic  CAF       Bangui  Sub-Saharan Africa
</pre>

Как видите, даже с таким небольшим набором инструментов, можно эффективно исследовать показатели стран и делать определенные выводы. Облегчают жизнь уже готовые решения для доступа к API, но и простой  RESTful API у Всемирного банка организован неплохо. Например, получить ту же информацию о количестве часов, которые необходимо затратить, чтобы открыть бизнес в Украине можно таким способом:

{% highlight python %}
import requests

r = requests.get('http://api.worldbank.org/countries/ukr/indicators/IC.REG.DURS', params = {'date': '2003:2016', 'format': 'json'})

json_data = r.json()
{% endhighlight %}

Дополнительную информацию о библиотеке wbdata, можно найти в [документации](https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information){:target"_blank" class="external"}.

Обзор Data API Всемирного банка доступен на сайте.



