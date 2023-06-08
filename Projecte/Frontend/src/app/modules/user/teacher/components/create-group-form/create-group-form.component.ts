import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { User } from 'src/app/shared/models/interfaces';

@Component({
  selector: 'app-create-group-form',
  templateUrl: './create-group-form.component.html',
  styleUrls: ['./create-group-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateGroupFormComponent implements OnInit {

  //per a l'input de creació de nou grup
  @Input() user: (User | null);
  nomNewGrup: string;
  descrNewGrup: string;

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
  }

    createGroup(formVal) {
    this.groupsService.createGrup(formVal.nomNewGrup, formVal.descrNewGrup, this.user.user_id).subscribe(res => {
      // console.log(res.id_grup);
      location.reload();
    })
  }

}
