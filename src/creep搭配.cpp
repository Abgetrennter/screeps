#include <iostream>
using namespace std;

int get_numschar(const string s, string sub) {
  int index = 0;
  int count = 0;

  while ((index = s.find(sub, index)) < s.length()) {
    count++;
    index++;
  }
  return count;
}

int main() {

  while (true) {

    string parts[] = { "MOVE" ,           "WORK" ,  "CARRY" ,  "ATTACK" ,
                       "RANGED_ATTACK" ,  "HEAL" ,  "CLAIM" ,  "TOUGH" };
    int count[] = {0, 0, 0, 0, 0, 0, 0, 0};
    int cost[]={50,100,50,80,150,250,600,10};
    string s;
    getline(cin, s);

    for (int i = 0; i < 8; i++) {
      count[i] = get_numschar(s, parts[i]);
    }

    for (int i = 0; i < 8; i++) {
      cout << parts[i] <<  ": "  << count[i] <<  "   " ;

      if ((i + 1) % 4 == 0)
        cout << endl;
    }
    cout << endl;

    //��������
    int all_cost=0;
    for (int i =0; i<8;i++){
      all_cost+=count[i]*cost[i];
    }
    cout << " һ��Ҫ���� " <<all_cost<< " ������ " <<endl<<endl;

    //�ۺϹ���
    cout << " ÿ tick: " << endl;
    if(count[1]>0){
      cout<< " �ɼ�  "  <<2*count[1]<<  " ��λ����, " <<count[1]<< " ����, " << " ���������ӹ��ؽ������ " << 5*count[1]<<  " �� " <<endl;
      cout <<  " ���� " <<100*count[1]<< " �;ö�,���� " <<count[1]<< " ����." <<" ���� " <<50*count[1]<< " �;ö�,���� " <<0.25*count[1]<< " ����" <<endl;
      cout << "����"<<count[1]<<"��"<<endl;
    }

    if(count[2]>0){
      cout<<"Я��"<<50*count[2]<<"����"<<endl;
    }
    if(count[3]>0){
      cout<<"���"<<30*count[3]<<"�˺�"<<endl;
    }
    if(count[4]>0){
      cout<<"���"<<10*count[3]<<"Զ���˺�"<<endl;
    }
    if(count[5]>0){
      cout<<"����"<<12*count[5]<<"���"<<4*count[5]<<endl;
    }
    //ռ����˵
    cout<<endl;
    //����ƣ��ֵ
    int tire = (-count[0]);
    //
    
    {
      for (int i = 1; i < 8; i++) tire += count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " �����ڵ�·���˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }

    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 2*count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " ������ƽԭ���˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }
    
    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 10*count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " �������������˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }

    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += count[i];
        tire-=count[2];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " ������·���˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }

    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 2*count[i];
        tire-=count[2];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " ������ƽԭ���˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }

    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 10*count[i];
        tire-=count[2];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " �������������˶�ʱÿ "  << i <<  " ��tick�ƶ�һ�� " <<endl;
    }
  }
}