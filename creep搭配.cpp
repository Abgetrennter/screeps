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

    //计算消耗
    int all_cost=0;
    for (int i =0; i<8;i++){
      all_cost+=count[i]*cost[i];
    }
    cout << " 一共要消耗 " <<all_cost<< " 的能量 " <<endl<<endl;

    //综合功能
    cout << " 每 tick: " << endl;
    if(count[1]>0){
      cout<< " 采集  "  <<2*count[1]<<  " 单位能量, " <<count[1]<< " 矿物, " << " 用能量增加工地建设进度 " << 5*count[1]<<  " 点 " <<endl;
      cout <<  " 增加 " <<100*count[1]<< " 耐久度,消耗 " <<count[1]<< " 能量." <<" 减少 " <<50*count[1]<< " 耐久度,返还 " <<0.25*count[1]<< " 能量" <<endl;
      cout << "升级"<<count[1]<<"点"<<endl;
    }

    if(count[2]>0){
      cout<<"携带"<<50*count[2]<<"能量"<<endl;
    }
    if(count[3]>0){
      cout<<"造成"<<30*count[3]<<"伤害"<<endl;
    }
    if(count[4]>0){
      cout<<"造成"<<10*count[3]<<"远程伤害"<<endl;
    }
    if(count[5]>0){
      cout<<"治疗"<<12*count[5]<<"点或"<<4*count[5]<<endl;
    }
    //占领再说
    cout<<endl;
    //计算疲劳值
    int tire = (-count[0]);
    //
    
    {
      for (int i = 1; i < 8; i++) tire += count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " 满载在道路上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
    }

    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 2*count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " 满载在平原上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
    }
    
    {
      tire = (-count[0]);
      for (int i = 1; i < 8; i++) tire += 10*count[i];
      int i=1;
      while(tire>0){
        i++;
        tire-=count[0];
      }
      cout <<  " 满载在沼泽上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
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
      cout <<  " 空载在路上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
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
      cout <<  " 空载在平原上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
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
      cout <<  " 空载在沼泽上运动时每 "  << i <<  " 个tick移动一格 " <<endl;
    }
  }
}